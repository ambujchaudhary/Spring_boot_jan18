import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Platform } from '@ionic/angular';
import { IOfferSent } from '../../profile.model';

@Component({
  selector: 'zu-offer-sent-modal',
  templateUrl: './offer-sent-modal.component.html',
  styleUrls: ['./offer-sent-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferSentModalComponent {
  private platform: Platform;

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: IOfferSent,
      private dialogRef: MatDialogRef<OfferSentModalComponent>,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  public isMobile(): boolean {
    try {
      if (this.platform.is('mobile')) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
