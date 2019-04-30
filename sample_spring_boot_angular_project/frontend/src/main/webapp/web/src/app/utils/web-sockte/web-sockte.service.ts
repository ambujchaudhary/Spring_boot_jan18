import { Injectable } from '@angular/core';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { first, takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { ChatService } from '../../shared/chat/chat.service';
import { NotificationsService } from '../../user/notifications/notifications.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { stompConfig, StompStateEnum } from './web-sockte.model';
import 'rxjs-compat/add/observable/timer';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private notifyStatesScription: Subscription;
  private chatStatesScription: Subscription;

  constructor(
      private stompService: StompService,
      private chatService: ChatService,
      private notificationsService: NotificationsService,
      private localStorageService: LocalStorageService
  ) {}

  public initSocket(authToken: string): void {
    try {
      const _stompConfig = Object.assign({}, stompConfig);
      _stompConfig.headers['Authorization'] = this.localStorageService.get('authToken');

      this.stompService.config = _stompConfig;
      this.initNotify(authToken);
      this.initChat(authToken);
    } catch (e) {
      console.error(`Can't init WebSocket: ${e}`);
    }
  }

  private initNotify(authToken: string) {
    // TODO move inside notificationsService
    if (this.notificationsService.isInit() === true) {

      if (this.notificationsService.isDisconnect() === true) {
        this.notificationsService.reconnectWebSocket();
      } else {
        return;
      }
    }

    this.notificationsService.connectWebSocket();

    this.notifyStatesScription = this.notificationsService.getSocketStateObservable()
    .pipe(takeWhile((data: StompStateEnum) => data !== StompStateEnum.CLOSED))
    .subscribe((state: string) => {
      console.log('< state notifyStatesScription', state);
      if (state === StompStateEnum.CONNECTED) {
        this.notificationsService.updateNotifications().pipe(first()).subscribe(() => {});
        this.chatService.getUnreadMessages().pipe(first()).subscribe(() => {});
      }
    });
  }

  private initChat(authToken: string) {
    // TODO move inside notificationsService
    if (this.chatService.isInit() === true) {

      if (this.chatService.isDisconnect() === true) {
        this.chatService.reconnectWebSocket();
      } else {
        return;
      }
    }

    this.chatService.connectWebSocket();

    this.chatStatesScription = this.chatService.getSocketStateObservable()
    .pipe(takeWhile((data: StompStateEnum) => data !== StompStateEnum.CLOSED))
    .subscribe((state: string) => {
      if (state === StompStateEnum.CONNECTED) {
        this.chatService.getUnreadMessages().pipe(first()).subscribe(() => {});
        this.notificationsService.updateNotifications().pipe(first()).subscribe(() => {});
      }
    });
  }

  public disconnect() {
    try {
      this.notificationsService.disconnectWebSocket();
      this.chatService.disconnectWebSocket();
    } catch (e) {
      console.error(`Can't disconnect WebSocket: ${e}`);
    }
  }
}
