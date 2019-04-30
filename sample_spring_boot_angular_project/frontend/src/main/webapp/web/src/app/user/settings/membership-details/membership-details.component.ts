import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { UserService } from '../../user.service';
import { CancelMembershipModalComponent } from '../cancel-membership-modal/cancel-membership-modal.component';
import { Subscriptions, SubscriptionStatusEnum, SubscriptionType } from '../settings.model';
import { MembershipDetailsModalComponent } from './membership-details-modal/membership-details-modal.component';

import * as moment from 'moment';

@Component({
  selector: 'zu-membership-details',
  templateUrl: './membership-details.component.html',
  styleUrls: ['./membership-details.component.scss']
})
export class MembershipDetailsComponent implements OnInit {

  @Input() subscriptions: Subscriptions[];
  @Output() cancelSubscriptionEmitter = new EventEmitter();

  public readonly subscriptionStatusEnum = SubscriptionStatusEnum;

  constructor(
      private dialog: MatDialog,
      private toaster: ToasterConfigService,
      private userService: UserService,
      private callbackService: CallbackHandlerService
  ) { }

  ngOnInit() {}

  private cancelSubscription(subscription: Subscriptions): void {
    const subscriptionType = new SubscriptionType(subscription.subscriptionType);

    this.userService.cancelSubscription(subscriptionType)
    .subscribe(
        () => {
          this.toaster.success('Subscription cancelled.');
          if (subscription.subscriptionStatus === this.subscriptionStatusEnum.ACTIVE) {
            subscription.subscriptionStatus = this.subscriptionStatusEnum.NON_RENEWING;
          } else {
            subscription.subscriptionStatus = this.subscriptionStatusEnum.CANCELLED;
          }

          this.cancelSubscriptionEmitter.emit();
        },
        (errorData) => {
          this.toaster.error(this.callbackService.getErrorMessage(errorData));
        });
  }

  private openCancelSubscriptionDialog(subscription: Subscriptions): void {
    const dialogRef = this.dialog.open(CancelMembershipModalComponent, {
      data: subscription
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.cancelSubscription(subscription);
          }
        }
    );
  }

  public getSubscriptionStatus(subscription: Subscriptions): SubscriptionStatusEnum | string {
    if (subscription.subscriptionStatus === this.subscriptionStatusEnum.ACTIVE || subscription.subscriptionStatus ===
        this.subscriptionStatusEnum.NON_RENEWING) {
      return this.subscriptionStatusEnum.ACTIVE;
    } else {
      return `from ${moment(subscription.dateFrom).format('DD MMMM YYYY')}`;
    }
  }

  public openSubscriptionDetailsModal(subscription: Subscriptions): void {
    const dialogRef = this.dialog.open(MembershipDetailsModalComponent, {
      data: subscription
    });

    dialogRef.afterClosed().subscribe(
        (res: Subscriptions) => {
          if (typeof res === 'object') {
            this.openCancelSubscriptionDialog(res);
          }
        }
    );
  }
}
