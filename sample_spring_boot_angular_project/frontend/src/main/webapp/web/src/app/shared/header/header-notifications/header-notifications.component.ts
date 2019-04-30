import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User, UserRole } from '../../../auth/auth.model';
import { Notification, NotificationMessage } from '../../../user/notifications/notifications.model';
import { NotificationsService } from '../../../user/notifications/notifications.service';
import { SessionStorageService } from '../../../utils/storage/session-storage.service';

@Component({
  selector: 'zu-header-notifications',
  templateUrl: './header-notifications.component.html',
  styleUrls: ['./header-notifications.component.scss']
})
export class HeaderNotificationsComponent implements OnInit, OnDestroy {
  @Output() jobEditedEmitter = new EventEmitter();

  private user: User;
  private readonly userRoleEnum = UserRole;

  public isPopupOpen = false;

  public datasubscription: Subscription;

  // Array of historic message (bodies)
  public notifications: Notification[];

  // A count of messages received
  public count = 0;

  public parsedNotificationMessages: Array<NotificationMessage[]>;

  @ViewChild('popup') popup: ElementRef;
  @ViewChild('popuptoggle') popupToggle: ElementRef;

  constructor(
      private notificationsService: NotificationsService,
      private sessionStorageService: SessionStorageService,
      private route: ActivatedRoute,
  ) { }

  @HostListener('document:click', ['$event']) onClickOutHandler(event) {
    if (!this.popup.nativeElement.contains(event.target) && !this.popupToggle.nativeElement.contains(event.target)) {
      this.hidePopup();
    }
  }

  ngOnInit() {
    this.notifications = this.notificationsService.getList();
    this.count = this.notificationsService.getCount();
    this.processStaticMessages();

    /** Consume a message from the WebSocet */
    try {
      this.checkSocketInit();
    } catch (e) {
      console.error(e);
    }
  }

  private processStaticMessages(): void {
    this.parsedNotificationMessages = this.notifications.map((notification) => {
      return this.notificationsService.parseMessageLinks(notification.message);
    });
  }

  private checkSocketInit(): void {
    if (this.notificationsService.isInit() === true) {
      this.datasubscription = this.notificationsService.getSocketDataObservable().subscribe(() => {
        this.notifications = this.notificationsService.getList();
        this.count = this.notificationsService.getCount();
        this.processStaticMessages();
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

  public markAsRead(id: string): void {
    this.notificationsService.markAsRead(id).subscribe(() => {
    });
  }

  public markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe(() => {
    });
  }

  public togglePopup(): void {
    this.isPopupOpen = !this.isPopupOpen;
  }

  public hidePopup(): void {
    this.isPopupOpen = false;
  }

  public getUser(): void {
    this.user = this.sessionStorageService.getObject<User>('user');
  }

  /*Reloading page in case that you are in job view page and clicked link on received job edited notification*/
  public checkForReloadUrl(title: string): void {
    if (this.route.snapshot.routeConfig.path === 'job/:id/view' && title === 'Job Edited') {
      this.jobEditedEmitter.emit();
    }
  }

  public checkForCodedUrl(title: string): boolean {
    if (title === 'Application Update') {
      return true;
    } else {
      return false;
    }
  }
}
