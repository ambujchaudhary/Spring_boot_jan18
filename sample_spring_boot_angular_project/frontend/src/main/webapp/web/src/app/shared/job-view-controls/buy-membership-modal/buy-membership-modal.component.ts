import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MembershipTypeEnum } from '../../../anonymous/anonymous.model';
import { SubscriptionTypeEnum } from '../../../user/settings/settings.model';
import { PurchaseMembershipModalData } from '../../../user/job/job.model';
import { ApplicationSentModalComponent } from '../application-sent-modal/application-sent-modal.component';

@Component({
  selector: 'zum-buy-membership-modal',
  templateUrl: './buy-membership-modal.component.html',
  styleUrls: ['./buy-membership-modal.component.scss'],
})
export class BuyMembershipModalComponent {
  public readonly membershipTypeEnum = MembershipTypeEnum;
  public readonly subscriptionTypeEnum = SubscriptionTypeEnum;

  public data: PurchaseMembershipModalData;

  constructor(
      private dialogRef: MatDialogRef<ApplicationSentModalComponent>,
      private overlayContainer: OverlayContainer,
      private renderer: Renderer2,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    if (typeof data !== 'undefined') {
      this.data = new PurchaseMembershipModalData(data.headerText, data.subheaderText, data.subscriptionsType);
    }

    const disableAnimations = true;

    const overlayContainerElement: HTMLElement = this.overlayContainer.getContainerElement();

    this.renderer.setProperty(overlayContainerElement, '@.disabled', disableAnimations);
  }

  public selectMembershipType(type: MembershipTypeEnum): void {
    this.dialogRef.close(type);
  }

  public isActive(type: SubscriptionTypeEnum): string {
    if (typeof this.data.subscriptionsType !== 'undefined' && this.data.subscriptionsType.includes(type)) {
      return 'disabled';
    }
  }
}
