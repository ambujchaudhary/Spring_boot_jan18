import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../../utils/messages.service';
import { Notification, NotificationMessage, NotificationsConfig } from './notifications.model';
import { NotificationsService } from './notifications.service';
import { unionBy } from 'lodash/array';

@Component({
  selector: 'zu-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  public page: number;
  public size: number;
  public notifications: Notification[];

  public isLastPage = false;
  public isUploadInProgress = false;

  public parsedNotificationMessages: Array<NotificationMessage[]>;

  constructor(
      private notificationsService: NotificationsService,
      private messagesService: MessagesService,
      private location: Location,
      private route: ActivatedRoute
  ) {
    this.notifications = [];
    this.page = NotificationsConfig.page;
    this.size = NotificationsConfig.size;
  }

  ngOnInit() {
    this.route.data.subscribe((data: {notifications: Notification[]}) => {
      this.processNewNotifications(data.notifications, false);
    });

    this.processStaticMessages();
  }

  private processStaticMessages(): void {
    this.parsedNotificationMessages = this.notifications.map((notification) => {
      return this.notificationsService.parseMessageLinks(notification.message);
    });
  }

  private uploadNotifications(): void {
    const options = {page: this.page, size: this.size};

    this.isUploadInProgress = true;

    this.notificationsService.getNotifications(options)
    .finally(() => this.isUploadInProgress = false)
    .subscribe(
        (data) => {
          this.processNewNotifications(data, true);
          this.processStaticMessages();
        });
  }

  private processNewNotifications(data = [], showMessage: boolean): void {
    this.notifications = unionBy(this.notifications, data, 'id');

    if (data.length < this.size) {
      this.isLastPage = true;

      if (showMessage === true) {
        this.messagesService.showInfo('notifications.you_have_no_new_notifications');
      }
    } else {
      this.page += 1;
    }

  }

  public markAsRead(id: string, index: number): void {
    if (this.notifications[index].hidden === true) {
      return;
    }

    this.notificationsService.markAsRead(id).subscribe(() => {
      this.notifications[index].hidden = true;
    });
  }

  public markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe(() => {
      this.notifications.forEach((item) => item.hidden = true);
    });
  }

  public uploadMoreNotifications(): void {
    if (this.isLastPage !== true) {
      this.uploadNotifications();
    }
  }

  public goBack() {
    this.location.back();
  }

  public checkForCodedUrl(title: string): boolean {
    if (title === 'Application Update') {
      return true;
    } else {
      return false;
    }
  }
}
