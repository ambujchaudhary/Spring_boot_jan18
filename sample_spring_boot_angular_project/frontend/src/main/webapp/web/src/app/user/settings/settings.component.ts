import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { User } from '../../auth/auth.model';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { SessionStorageService } from '../../utils/storage/session-storage.service';
import { MessagesService } from '../../utils/messages.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { NotificationSettings, Radius } from '../job/job.model';
import { JobService } from '../job/job.service';
import { UserService } from '../user.service';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { Subscriptions, SubscriptionTypeEnum } from './settings.model';

@Component({
  selector: 'zu-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input() mobile = false;

  public notificationSettings: NotificationSettings;
  public sliderValue: number;
  public isSaveInProgress = false;
  public radiusOptions: Radius[];
  public user: User;
  public platform: Platform;

  public subscriptions: Subscriptions[];

  constructor(private userService: UserService,
              private jobService: JobService,
              private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private dialog: MatDialog,
              private sessionStorageService: SessionStorageService,
              private messagesService: MessagesService,
              private router: Router,
              private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  ngOnInit() {
    this.radiusOptions = [10, 50, 100, 300, 500, 1000];
    this.getSettings();
    this.getUser();

    this.getSubscriptions();
    this.getSubscriptionTypes();
  }

  private getUser(): void {
    this.user = this.sessionStorageService.getObject<User>('user');
  }

  private setRadius(value: number): string {
    const obj = {
      1: '10',
      2: '50',
      3: '100',
      4: '300',
      5: '500',
      6: '1000',
    };

    return obj[value];
  }

  private getSettings(): void {
    this.jobService.getNotificationsSettings()
    .subscribe(
        (data) => {
          this.notificationSettings = data;
          this.sliderValue = this.getRadiusByValue(this.notificationSettings.radius);
        },
        (error) => {
          this.messagesService.showError('common.message_error');
        }
    );
  }

  private fillSettings(): NotificationSettings {
    this.notificationSettings.radius = this.setRadius(this.sliderValue);

    return this.notificationSettings;
  }

  public getRadiusByValue(radius: string): number {
    const obj = {
      10: 1,
      50: 2,
      100: 3,
      300: 4,
      500: 5,
      1000: 6,
    };

    return obj[radius];
  }

  public setSettings(): void {
    this.isSaveInProgress = true;

    this.jobService.setNotificationsSettings(this.fillSettings())
    .finally(
        () => {this.isSaveInProgress = false; }
    )
    .subscribe(
        () => {
          this.messagesService.showSuccess('settings.settings_saved');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.messagesService.showError('common.message_error');
        }
    );
  }

  public openIntercom(): void {
    (<any>window).Intercom('show');
  }

  public openChangePasswordModal(): void {
    this.dialog.open(ChangePasswordModalComponent, {
      panelClass: 'accept-offer-modal',
    });
  }

  public isNotIos(): boolean {
    if (this.mobile === true) {
      return false;
    } else {
      return true;
    }
  }

  public getSubscriptions() {
    this.userService.getSubscriptions().subscribe(
        (data: Subscriptions[]) => {
          this.subscriptions = data;
        },
        (errorData: any) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });
  }

  public getSubscriptionTypes(): SubscriptionTypeEnum[] {
    if (typeof this.subscriptions !== 'undefined' && Array.isArray(this.subscriptions)) {
      const result: SubscriptionTypeEnum[] = [];

      this.subscriptions.forEach((item) => {
        result.push(item.subscriptionType);
      });

      return result;
    }
  }
}
