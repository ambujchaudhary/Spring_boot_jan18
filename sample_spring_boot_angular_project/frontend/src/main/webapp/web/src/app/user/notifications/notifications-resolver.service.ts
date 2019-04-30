import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Notification, NotificationsConfig } from './notifications.model';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsResolverService {

  constructor(private notificationsService: NotificationsService) { }

  resolve(): Observable<Notification[]> | Promise<Notification[]> | Notification[] {
    const options = {page: NotificationsConfig.page, size: NotificationsConfig.size};
    return this.notificationsService.getNotifications(options)
    .catch(() => Observable.of([]))
    .do((data) => data);
  }
}
