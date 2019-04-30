import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { User } from '../../../../auth/auth.model';
import { JobUtilsService } from '../../../../utils/job-utils.service';
import { MessagesService } from '../../../../utils/messages.service';
import { SessionStorageService } from '../../../../utils/storage/session-storage.service';
import { ChatNewMessage } from '../../../../shared/chat/chat.model';
import { ChatService } from '../../../../shared/chat/chat.service';
import { SendMessageModalComponent } from '../../../profile/profile-view/send-message-modal/send-message-modal.component';
import { CompleteJobModalData, JobOverview, JobReport } from '../../job.model';
import { JobService } from '../../job.service';
import { CompleteJobModalComponent } from './complete-job-modal/complete-job-modal.component';

@Component({
  selector: 'zu-job-summary-footer',
  templateUrl: './job-summary-footer.component.html',
  styleUrls: ['./job-summary-footer.component.scss']
})
export class JobSummaryFooterComponent implements OnInit {

  @Input() job: JobOverview;
  @Input() amount: string;
  @Input() askQuestion: boolean;
  @Input() ownerActiveJobButtons: boolean;

  public isButtonDisabled = false;
  public starsCount: number;
  private jobReport: JobReport;
  private user: User;
  private messageToSend: ChatNewMessage;

  constructor(private dialog: MatDialog,
              private jobService: JobService,
              private messagesService: MessagesService,
              private jobUtilsService: JobUtilsService,
              private chatService: ChatService,
              private sessionStorageService: SessionStorageService) {}

  ngOnInit() {
    this.jobReport = new JobReport();
    this.getUserInfo();
  }

  private completeJob(): void {
    this.jobReport.star = this.jobUtilsService.getStarsByValue(this.starsCount);

    this.jobService.completeJob(this.jobReport, parseInt(this.job.id, 10)).subscribe(
        () => {
          this.isButtonDisabled = true;
          this.messagesService.showSuccess('complete_job.complete_job_success');
        },
        () => {
          this.isButtonDisabled = false;
          this.messagesService.showError('common.message_error');
        }
    );
  }

  private sendMessage(): void {
    this.isButtonDisabled = true;
    this.chatService.send(this.messageToSend)
    .finally(
        () => {
          this.isButtonDisabled = false;
        }
    )
    .subscribe(
        () => {
          this.messagesService.showSuccess('send_message.message_send_success');
        },
        (error) => {
          this.messagesService.showError('send_message.message_send_error');
        }
    );
  }

  private getUserInfo(): void {
    this.user = this.sessionStorageService.getObject<User>('user');
  }

  private getUserNameForModal(): string {
    if (this.askQuestion) {
      return this.job.ownerType;
    } else {
      return this.job.shooterFullName;
    }
  }

  public openCompleteJobModal(): void {
    const dialogRef = this.dialog.open(CompleteJobModalComponent, {
      data: {
        id: this.job.id
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe((data: CompleteJobModalData) => {
          if (typeof data !== 'undefined' && data.result === true) {
            this.jobReport.review = data.review;
            this.starsCount = data.rate;
            this.completeJob();
          }
        }
    );
  }

  public openSendMessageModal(): void {
    const dialogRef = this.dialog.open(SendMessageModalComponent, {
      data: {
        recipientName: this.getUserNameForModal()
      },
      panelClass: 'send-message-modal'
    });

    dialogRef.afterClosed().subscribe((data) => {
          if (data.result === true) {
            // Check who send a message
            const recipientId = this.askQuestion ? this.job.ownerId : this.job.shooterId;

            this.messageToSend = new ChatNewMessage(this.job.id, recipientId, this.user.id, data.message);

            this.sendMessage();
          }
        }
    );
  }
}
