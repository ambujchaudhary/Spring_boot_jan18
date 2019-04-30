import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ApplicationSentModalComponent } from '../../../../shared/job-view-controls/application-sent-modal/application-sent-modal.component';
import { Subscriptions, SubscriptionStatusEnum, SubscriptionTypeEnum } from '../../settings.model';

@Component({
  selector: 'zum-membership-details-modal',
  templateUrl: './membership-details-modal.component.html',
  styleUrls: ['./membership-details-modal.component.scss']
})
export class MembershipDetailsModalComponent  {
  public data: Subscriptions;
  public readonly subscriptionTypeEnum = SubscriptionTypeEnum;
  public readonly subscriptionStatusEnum = SubscriptionStatusEnum;

  constructor(
      private dialogRef: MatDialogRef<ApplicationSentModalComponent>,
      @Inject(MAT_DIALOG_DATA) data: Subscriptions
  ) {
    if (typeof data !== 'undefined') {
      this.data = data;
    }
  }

  public cancelSubscription(): void {
    this.dialogRef.close(this.data);
  }
}
