import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '../../auth/auth.model';
import { AuthService } from '../../auth/auth.service';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { NewJobResponse } from '../../user/job/job.model';
import { ChatDialogMessage, ChatDialogMessageMataData, ChatJob, ChatMember, ChatRecipientsMataData, MessageStatusEnum } from './chat.model';
import { ChatService } from './chat.service';

@Component({
  selector: 'zu-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Input() isMobile = false;

  private user: User;
  public openedDialog: ChatDialogMessage[];
  public jobList: ChatJob[];
  public selectedJobId: string | null;

  public recipientList: ChatRecipientsMataData;
  public selectedRecipientId: string | null;

  public dialogList: ChatDialogMessageMataData;

  public messageInput = '';
  public dialogUndreadMessage = '';
  public dialogUndreadMessageProtected = '';

  public isNewUnread = false;
  private lastScrollMessageId: string;

  constructor(
      private authService: AuthService,
      private chatService: ChatService,
      private callbackService: CallbackHandlerService,
      private toaster: ToasterConfigService,
      private route: ActivatedRoute
  ) {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    // Get data for show unread dialogs data
    this.jobList = this.chatService.getJobs();
    this.recipientList = this.chatService.getRecipients();
    this.dialogList = this.chatService.getDialogs();

    // Get all job list with read and unread dialogs
    this.updateJobList();

    // Subscribe on web socket changes
    this.chatService.getSocketDataObservable().subscribe(
        (data) => {
          this.jobList = this.chatService.getJobs();
          this.recipientList = this.chatService.getRecipients();
          this.dialogList = this.chatService.getDialogs();

          this.getUnreadMessages();
        },
        () => {
        });

    if (this.isMobile === true) {
      this.checkMessage();
    }
  }

  public scrollDialogToBottom(el: any, id: string): void {
    if (this.lastScrollMessageId === id) {
      return;
    } else {
      this.lastScrollMessageId = id;
    }

    el.scrollIntoView(false);
  }

  private updateJobList(): void {
    this.chatService.getAllChatJobs().pipe(first()).subscribe((jobList) => {
      this.chatService.updateChatJobsList(jobList);
      this.jobList = this.chatService.getJobs();
    });
  }

  private updateRecipientList(id: string): void {
    this.chatService.getAllChatMembers(id).pipe(first()).subscribe((chatMembers) => {
      this.chatService.updateChatRecipientList(id, chatMembers);
      this.recipientList = this.chatService.getRecipients();
    });
  }

  private updateDialogList(jobId: string, recipientId: string): void {
    this.chatService.resetDialog(jobId, recipientId);

    this.chatService.getAllMessages(jobId, recipientId).subscribe((messages) => {
      this.chatService.updateDialogList(messages);
      this.dialogList = this.chatService.getDialogs();

      this.openedDialog = this.getDialogList(this.selectedJobId, this.selectedRecipientId);

      // whait 1s for skip miss click and mark all messages as unread
      const dalay = 1000;
      setTimeout(
          () => {
            if (recipientId === this.selectedRecipientId) {
              this.dialogUndreadMessageProtected = this.dialogUndreadMessage;
              this.markAllAsRead(this.selectedJobId, this.selectedRecipientId);
            }
          },
          dalay);

      this.getUnreadMessages();
    });
  }

  private getUnreadMessages(): void {
    if ((this.selectedRecipientId || '').length > 0) {
      const currentJob = this.recipientList[this.selectedJobId] || {};
      const currentRecipient = currentJob.find((i) => i.userId === this.selectedRecipientId) || {};
      const listIdOfUreadMessages = (currentRecipient.count || []);

      this.isNewUnread = (this.dialogUndreadMessage || '').length > 0;

      this.dialogUndreadMessage = listIdOfUreadMessages[0] || this.dialogUndreadMessageProtected || '';
    }
  }

  public calcUnreadRecipient(jobId: string): number {
    return this.chatService.calcUnreadRecipient(jobId);
  }

  public selectJob(id: string): void {
    // un select job if user click twice
    if (this.selectedJobId === id) {
      this.selectedJobId = null;
    } else {
      this.selectedJobId = id;

      // Get all job list with read and unread dialogs
      this.updateRecipientList(id);
    }

    // reset recipient and close dialog
    this.resetDialogUnreadMessage();
    this.selectedRecipientId = null;
    this.lastScrollMessageId = '';
    this.openedDialog = [];

  }

  public selectRecipient(id: string): void {
    if (this.selectedRecipientId !== id) {
      this.selectedRecipientId = id;
      this.resetDialogUnreadMessage();
      this.updateDialogList(this.selectedJobId, id);

      // Reset message from
      this.messageInput = '';
      this.lastScrollMessageId = '';
    }
  }

  private checkMessage(): void {
    if (this.route.snapshot.queryParams['jobId']) {
      this.selectJob(this.route.snapshot.queryParams['jobId']);

      if (this.route.snapshot.queryParams['userId']) {
        this.selectRecipient(this.route.snapshot.queryParams['userId']);
      }
    }
  }

  public isDialogSelected(jobId: string | null, recipientId: string | null): boolean {
    return jobId !== null && recipientId !== null && typeof jobId !== 'undefined' && typeof recipientId !== 'undefined';
  }

  public getDialogList(jobId: string, recipientId: string): ChatDialogMessage[] {
    if (this.isDialogSelected(jobId, recipientId)) {
      const key = this.chatService.getDialogKey(jobId, recipientId);
      return this.dialogList[key];
    } else {
      return [];
    }
  }

  public sendMessage(): void {

    const text = this.messageInput.trim();

    if (text.length === 0) {
      return;
    }

    this.messageInput = '';

    const message = {
      jobId: this.selectedJobId,
      recipient: this.selectedRecipientId,
      sender: this.user.id,
      text,
    };

    this.markAllAsRead(this.selectedJobId, this.selectedRecipientId);

    this.chatService.send(message).subscribe(
        (data: NewJobResponse) => {},
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
    //    const message: ChatNewMessage;
  }

  public markAllAsRead(selectedJobId: string, selectedRecipientId: string): void {

    const openJobMembers = this.recipientList[selectedJobId];
    const recipientData = (openJobMembers || []).find((i) => i.userId === selectedRecipientId);

    const {count = []} = (recipientData || {});

    if (count.length > 0) {
      this.chatService.markAsReadAll(count).subscribe((data) => {
        recipientData.count = [];
      });
    }
  }

  public setMessageClass(item: ChatDialogMessage): string {
    if (item.mine === true) {
      return 'my-message';
    } else {
      return 'default-message';
    }
  }

  public getRecipientName(jobId: string | null, recipientId: string | null): string {
    if (this.isDialogSelected(jobId, recipientId)) {
      const recipients = this.recipientList[jobId];
      const recipient = recipients.find((i) => i.userId === recipientId);
      return `${recipient.firstName} ${recipient.lastName}`;
    }
  }

  public isStringIdExist(id: string | number): boolean {
    if (id === null || id === undefined) {
      return false;
    } else {
      return true;
    }
  }

  public isDateDifferent(index: number, date = ''): boolean {
    const isFirstItem = index === 0;

    if (isFirstItem) {
      return true;
    }

    if (Array.isArray(this.openedDialog) === false) {
      return false;
    }

    const previousDateMatch = date.length > 0 && date !== this.openedDialog[index - 1].date;
    return previousDateMatch;
  }

  public resetDialogUnreadMessage() {
    this.dialogUndreadMessage = '';
    this.dialogUndreadMessageProtected = '';
    this.isNewUnread = false;
    this.lastScrollMessageId = '';
  }
}
