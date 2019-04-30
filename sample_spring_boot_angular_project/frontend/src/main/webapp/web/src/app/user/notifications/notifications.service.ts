import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StompConfig, StompService, StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { stompConfig, StompStateEnum, WebSocketConfig } from '../../utils/web-sockte/web-sockte.model';

import { Notification, NotificationMessage, NotificationPaginationOptions } from './notifications.model';

@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  private prefix: string;

  public message: Observable<Message>;
  public wsstate: Observable<StompStateEnum>;

  private init = false;
  private disconnect = false;

  private notifications: Notification[];
  private count: number;

  private socketDataSubscription: Subscription;
  private socketStateSubscription: Subscription;

  private baseUrl = environment.baseUrl;

  private _stompConfig: StompConfig;

  constructor(
      private stompService: StompService,
      private httpClient: HttpClient,
      private localStorageService: LocalStorageService
  ) {
    this.prefix = this.baseUrl + '/api/protected';

    console.log('< WebSocketConfig.url', WebSocketConfig.url);
    console.log('< WebSocketConfig.notify', WebSocketConfig.notify);
    console.log('< stompConfig', stompConfig);

    this._stompConfig = Object.assign({}, stompConfig) as StompConfig;
  }

  public connectWebSocket(): void {
    if (this.disconnect === true) {
      return;
    }
    this._stompConfig.headers['Authorization'] = this.localStorageService.get('authToken');
    this.stompService.config = this._stompConfig;

    this.wsstate = this.stompService.state.pipe(map((state: number) => StompState[state] as StompStateEnum));
    this.message = this.stompService.subscribe(WebSocketConfig.notify);

    // Store message in "notification" queue
    this.notifications = [];
    this.count = 0;

    this.socketDataSubscription = this.getSocketDataObservable().subscribe((message: Message) => {
      console.log('< state message', message);
      this.addUnreadNotification(JSON.parse(message.body) as Notification);
    });

    this.socketStateSubscription = this.getSocketStateObservable().subscribe((state: string) => {
      console.log('< state socketStateSubscription init', state);
      this.init = true;
    });
  }

  public disconnectWebSocket() {
    this.disconnect = true;
    this.stompService.disconnect();

    if (typeof this.socketDataSubscription !== 'undefined') {
      this.socketDataSubscription.unsubscribe();
    }

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

  private addUnreadNotification(newNotification: Notification) {
    const existNotificationIndex = this.notifications.findIndex((notificationItem) => notificationItem.id === newNotification.id);

    if (existNotificationIndex === -1 && newNotification.hidden === false) {
      this.notifications.unshift(newNotification);
      this.count = this.notifications.length;
    } else if (newNotification.hidden === true) {

      this.notifications.splice(existNotificationIndex, 1);
      this.count = this.notifications.length;
    }

  }

  public getList(): Notification[] {
    return this.notifications ? JSON.parse(JSON.stringify(this.notifications)) : [];
  }

  public getCount(): number {
    return this.count || 0;
  }

  public getSocketDataObservable() {
    return this.message;
  }

  public getSocketStateObservable() {
    return this.wsstate;
  }

  public getNotifications(options: NotificationPaginationOptions): Observable<Notification[]> {
    let params = new HttpParams();

    Object.keys(options).forEach((param) => {
      if (options[param]) {
        params = params.set(param, options[param]);
      }
    });

    return this.httpClient.get<Notification[]>(`${this.prefix}/notifications?sort=eventDate,desc`, {params});
  }

  public updateNotifications(): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/notifications`, {});
  }

  public markAsRead(id: string): Observable<any> {
    return this.httpClient.put<any>(`${this.prefix}/notifications/${id}/hide`, {});
  }

  public markAllAsRead(): Observable<any> {
    return this.httpClient.put<any>(`${this.prefix}/notifications/hide`, {});
  }

  public isInit(): boolean {
    return this.init;
  }

  public isDisconnect(): boolean {
    return this.disconnect;
  }

  public parseMessageLinks(message = ''): NotificationMessage[] {
    let messageArr: NotificationMessage[];
    const urlSeparator = '[[url]]';
    const urlSeparatorOpen = '[[url=';
    const urlSeparatorClose = ']]';

    messageArr = message.split(urlSeparator).reduce(
        (result, item) => {
          if (item.includes(urlSeparatorOpen)) {
            const splitedLink = item.split(urlSeparatorClose);
            const text = splitedLink[1];

            const splitedUrl = splitedLink[0].split(urlSeparatorOpen);
            const textBefore = splitedUrl[0];
            const url = splitedUrl[1];

            return [...result, {isUrl: true, url, textBefore, text}];
          } else {
            return [...result, {isUrl: false, text: item}];
          }
        },
        []);

    return messageArr;
  }
}
