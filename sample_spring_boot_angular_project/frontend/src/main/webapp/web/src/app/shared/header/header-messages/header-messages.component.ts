import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User, UserRole } from '../../../auth/auth.model';
import { SessionStorageService } from '../../../utils/storage/session-storage.service';
import { ChatService } from '../../chat/chat.service';

@Component({
  selector: 'zu-header-messages',
  templateUrl: './header-messages.component.html',
  styleUrls: ['./header-messages.component.scss']
})
export class HeaderMessagesComponent implements OnInit, OnDestroy {

  private user: User;
  private readonly userRoleEnum = UserRole;

  public datasubscription: Subscription;

  // A count of messages received
  public count = 0;

  constructor(private chatService: ChatService,
              private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    this.getUser();

    if (typeof this.user !== 'undefined' && this.user !== null && this.user.role === this.userRoleEnum.USER) {
      try {
        this.checkSocketInit();
      } catch (e) {
        console.error(e);
      }
    }
  }

  private checkSocketInit(): void {
    if (this.chatService.isInit() === true) {
      this.count = this.chatService.getCount();
      this.datasubscription = this.chatService.getSocketDataObservable().subscribe(() => {
        this.count = this.chatService.getCount();
      });
    } else {
      setTimeout(
          () => {
            this.checkSocketInit();
          },
          50);
    }
  }

  ngOnDestroy() {
    if (typeof this.user !== 'undefined' && this.user !== null && this.user.role === this.userRoleEnum.USER) {
      try {
        this.datasubscription.unsubscribe();
      } catch (e) {
        console.error(e);
      }
    }
  }

  public getUser(): void {
    this.user = this.sessionStorageService.getObject<User>('user');
  }
}
