import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StompConfig, StompService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs/Observable';
import { unionBy } from 'lodash/array';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { User } from '../../auth/auth.model';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { SessionStorageService } from '../../utils/storage/session-storage.service';
import { stompConfig, StompStateEnum, WebSocketConfig } from '../../utils/web-sockte/web-sockte.model';
import {
  ChatDialogMessage,
  ChatDialogMessageMataData,
  ChatJob,
  ChatMember,
  ChatMessage,
  ChatNewMessage,
  ChatRecipientsMataData,
  MessageStatusEnum
} from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private prefix: string;

  private user: User;

  //  public wsMessage: Observable<Message>;
  public wsMessage: Observable<any>;
  public wsState: Observable<StompStateEnum>;

  private init = false;
  private disconnect = false;

  private messagesList: ChatMessage[];
  private count: number;

  private socketStateSubscription: Subscription;

  public recipients: ChatRecipientsMataData;
  public dialogs: ChatDialogMessageMataData;
  public jobs: ChatJob[];

  private baseUrl = environment.baseUrl;

  private _stompConfig: StompConfig;

  constructor(
      private stompService: StompService,
      private sessionStorageService: SessionStorageService,
      private localStorageService: LocalStorageService,
      private httpClient: HttpClient
  ) {
    this.prefix = this.baseUrl + '/api/protected';
    this.recipients = {};
    this.dialogs = {};
    this.jobs = [];

    this._stompConfig = Object.assign({}, stompConfig) as StompConfig;
    this._stompConfig.headers['Authorization'] = this.localStorageService.get('authToken');
    this.stompService.config = this._stompConfig;
  }

  public connectWebSocket(): void {
    if (this.disconnect === true) {
      return;
    }

    this._stompConfig.headers['Authorization'] = this.localStorageService.get('authToken');
    this.stompService.config = this._stompConfig;

    this.wsState = this.stompService.state.pipe(map((state: number) => StompState[state] as StompStateEnum));
    this.wsMessage = this.stompService.subscribe(WebSocketConfig.message).pipe(map((message: Message) => {
      if (this.user === null) {
        this.user = this.sessionStorageService.getObject<User>('user');
      }

      this.processMessageMataData(JSON.parse(message.body) as ChatMessage);
    }));

    // Store message in "notification" queue
    this.messagesList = [];
    this.count = 0;

    this.socketStateSubscription = this.getSocketStateObservable().subscribe((state: string) => {
      this.init = true;
      this.user = this.sessionStorageService.getObject<User>('user');
    });
  }

  public updateChatJobsList(jobList: ChatJob[]): void {
    this.jobs = unionBy(this.getJobs(), jobList, 'id');
  }

  public updateChatRecipientList(jobId: string, chatMembers: ChatMember[]): void {
    chatMembers.forEach((aMember) => {
      if (typeof this.recipients[jobId] === 'undefined') {
        this.recipients[jobId] = [aMember];
      } else {
        const recipientIndex = this.recipients[jobId].findIndex((aRecipient) => aRecipient.userId === aMember.userId);

        if (recipientIndex !== -1) {
          const existMember = this.recipients[jobId][recipientIndex];
          this.recipients[jobId][recipientIndex] = Object.assign(existMember, aMember);
        } else {
          this.recipients[jobId].push(aMember);
        }
      }

    });
  }

  public resetDialog(jobId: string, userId: string): void {
    const key = this.getDialogKey(jobId, userId);
    this.getDialogs()[key] = [];
  }

  public updateDialogList(messages: ChatMessage[]): void {
    (messages || []).forEach((aMessage) => this.processMessageMataData(aMessage));
  }

  public calcUnreadRecipient(jobId: string): number {
    const jobRecipients = this.recipients[jobId];
    const unreadJobRecipients = (jobRecipients || []).filter((item) => (item.count || []).length);

    return unreadJobRecipients.length || 0;
  }

  public calcUnreadJob(): number {
    let count = 0;

    (this.jobs || []).forEach((aJob) => {
      // calc unread messages inside dialog
      if (this.calcUnreadRecipient(aJob.id) > 0) {
        count++;
      }
    });

    return count;
  }

  public getDialogKey(jobId = '', recipientId = ''): string {
    return `${jobId}__${recipientId}`;
  }

  public disconnectWebSocket() {
    this.disconnect = true;
    this.stompService.disconnect();

    if (typeof this.socketStateSubscription !== 'undefined') {
      this.socketStateSubscription.unsubscribe();
    }
  }

  public reconnectWebSocket(): void {
    this._stompConfig.headers['Authorization'] = this.localStorageService.get('authToken');
    this.stompService.config = this._stompConfig;
    this.stompService.initAndConnect();

    // init connections
    this.connectWebSocket();

    // variables disconnect and init shoud be after connectWebSocket()
    this.disconnect = false;
    this.init = true;

  }

  private isMineUnreadMessage(message: ChatMessage, userId: string): boolean {
    return message.status === MessageStatusEnum.UNREAD && userId === message.recipient.userId;
  }

  // TODO split method on small functions
  public processMessageMataData(message: ChatMessage): void {
    const userId = this.user.id;
    const job = message.chatJobDTO;
    const targetRecipient = this.detectRecipient(message, userId);

    const dialogMessage: ChatDialogMessage = {
      id: message.id,
      text: message.text,
      sentDate: message.sentDate,
      date: this.splitDateForCompare(message.sentDate),
      status: message.status,
      mine: userId === message.sender.userId,
    };

    // Add message in dialog
    this.processWebSocketDialog(job.id, targetRecipient.userId, dialogMessage);

    // Add member to recipient list
    if (typeof this.recipients[job.id] === 'undefined') {
      const tmpJob = Object.assign({}, job);

      this.recipients[job.id] = [targetRecipient];

      if (this.isMineUnreadMessage(message, userId) === true) {
        targetRecipient.count = unionBy(targetRecipient.count, [message.id]);
      } else {
        targetRecipient.count = (targetRecipient.count || []).filter((unreadMessId) => unreadMessId !== message.id);
      }

      this.updateChatJobsList([tmpJob]);
    } else {
      const existRecipient = this.recipients[job.id].find((item) => item.userId === targetRecipient.userId);

      if (typeof existRecipient !== 'undefined') {
        if (this.isMineUnreadMessage(message, userId) === true) {
          existRecipient.count = unionBy(existRecipient.count, [message.id]);
        } else {
          existRecipient.count = (existRecipient.count || []).filter((unreadMessId) => unreadMessId !== message.id);
        }
      } else {
        this.recipients[job.id].push(targetRecipient);

        if (this.isMineUnreadMessage(message, userId) === true) {
          targetRecipient.count = unionBy(targetRecipient.count, [message.id]);
        } else {
          targetRecipient.count = (targetRecipient.count || []).filter((unreadMessId) => unreadMessId !== message.id);
        }
      }
    }

    this.count = this.calcUnreadJob();
  }

  //  private getArrayOfUnreadMessages(recipient: ChatMember, message: ChatMessage): string[] {
  //    const unreadMessageIds = [];
  //
  //    if (this.isMineUnreadMessage(message, userId) === true) {
  //      unreadMessageIds = unionBy(existRecipient.count, [message.id]);
  //    } else {
  //      unreadMessageIds = (existRecipient.count || []).filter((unreadMessId) => unreadMessId !== message.id);
  //    }
  //
  //    return unreadMessageIds;
  //  }

  private processWebSocketDialog(jobId: string, recipientUserId: string, dialogMessage: ChatDialogMessage): void {
    const dialogKey = this.getDialogKey(jobId, recipientUserId);

    if (typeof this.dialogs[dialogKey] === 'undefined') {
      this.dialogs[dialogKey] = [dialogMessage];
    } else {
      const existDialogMessage = this.dialogs[dialogKey].find((aMessage) => aMessage.id === dialogMessage.id);

      if (typeof existDialogMessage === 'object') {
        if (existDialogMessage.status !== dialogMessage.status) {
          existDialogMessage.status = dialogMessage.status;
        }
      } else {
        this.dialogs[dialogKey].push(dialogMessage);
      }
    }
  }

  private detectRecipient(message: ChatMessage, userId: string): ChatMember {
    const recipient = userId === message.sender.userId ? message.recipient : message.sender;
    return Object.assign({}, recipient);
  }

  private addMessage(newMessage: ChatMessage) {
    this.messagesList.push(newMessage);
    this.count = this.messagesList.length;

  }

  //  Only for client side
  public splitDateForCompare(date: string): string {
    if (typeof date === 'string' && date.length > 0) {
      return date.split('T')[0];
    }

    return '';
  }

  public getList(): ChatMessage[] {
    return this.messagesList ? JSON.parse(JSON.stringify(this.messagesList)) : [];
  }

  public getCount(): number {
    return this.count || 0;
  }

  public getSocketDataObservable() {
    return this.wsMessage;
  }

  public getSocketStateObservable() {
    return this.wsState;
  }

  //
  //  public getNotifications(options: NotificationPaginationOptions): Observable<Notification[]> {
  //    let params = new HttpParams();
  //
  //    Object.keys(options).forEach((param) => {
  //      if (options[param]) {
  //        params = params.set(param, options[param]);
  //      }
  //    });
  //
  //    return this.httpClient.get<Notification[]>(`${this.prefix}/messagesList?sort=eventDate,desc`, {params});
  //  }

  public isInit(): boolean {
    return this.init;
  }

  public isDisconnect(): boolean {
    return this.disconnect;
  }

  public getRecipients(): ChatRecipientsMataData {
    return this.recipients || new ChatRecipientsMataData();
  }

  public getDialogs(): ChatDialogMessageMataData {
    return this.dialogs || new ChatDialogMessageMataData();
  }

  public getJobs(): ChatJob[] {
    return this.jobs || [];
  }

  /*
  *
  * HTTP requests
  * */

  public getAllChatJobs(): Observable<ChatJob[]> {
    return this.httpClient.get<ChatJob[]>(`${this.prefix}/messages/jobs`);
  }

  public getAllChatMembers(jobId: string): Observable<ChatMember[]> {
    return this.httpClient.get<ChatMember[]>(`${this.prefix}/messages/jobs/${jobId}`);
  }

  public getAllMessages(jobId: string, userId: string): Observable<ChatMessage[]> {
    return this.httpClient.get<ChatMessage[]>(`${this.prefix}/messages/jobs/${jobId}/recipient/${userId}`);
  }

  public markAsReadAll(requestParam: string[]): Observable<any[]> {
    return this.httpClient.put<any[]>(`${this.prefix}/messages/read`, {ids: requestParam});
  }

  public getUnreadMessages(): Observable<any> {
    return this.httpClient.get<any>(`${this.prefix}/messages`);
  }

  public send(requestParam: ChatNewMessage): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/messages`, requestParam);
  }

}
