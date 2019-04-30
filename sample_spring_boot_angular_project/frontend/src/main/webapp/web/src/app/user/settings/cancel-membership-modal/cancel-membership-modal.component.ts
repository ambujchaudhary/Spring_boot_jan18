import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { Subscriptions, SubscriptionStatusEnum } from '../settings.model';

@Component({
  selector: 'zu-cancel-membership-modal',
  templateUrl: './cancel-membership-modal.component.html',
  styleUrls: ['./cancel-membership-modal.component.scss']
})
export class CancelMembershipModalComponent {

  public data: Subscriptions;
  public readonly subscriptionStatusEnum = SubscriptionStatusEnum;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

    if (data !== null) {
      this.data = data;
    }
  }

  public cancel() {
    this.dialogRef.close(true);
  }
}
