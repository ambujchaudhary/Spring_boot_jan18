import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Platform } from '@ionic/angular';
import { ModalDialogComponent } from '../../../../shared/modal-dialog/modal-dialog.component';
import { MathService } from '../../../../utils/math.service';
import { ValidationService } from '../../../../utils/validation.service';
import { Job } from '../../job.model';

@Component({
  selector: 'zu-accept-offer-modal',
  templateUrl: './accept-offer-modal.component.html',
  styleUrls: ['./accept-offer-modal.component.scss']
})
export class AcceptOfferModalComponent implements OnInit {

  public job: Job;
  public termsAgreement = false;

  private platform: Platform;

  constructor(
      private dialogRef: MatDialogRef<ModalDialogComponent>,
      @Inject(MAT_DIALOG_DATA) data,
      private validationService: ValidationService,
      private mathService: MathService,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }

    if (data !== null) {
      this.job = data.job;
    }
  }

  public acceptOffer() {
    this.dialogRef.close(true);
  }

  ngOnInit() {
  }

  public calcTotalAmount(): number {
    let totalAmount: number;
    const defaultTotal = 0;

    const {pricePerHour, numberOfHour} = this.job;
    const isPrice = this.validationService.isStringNotEmpty(pricePerHour);
    const isNumber = this.validationService.isStringNotEmpty(numberOfHour);

    if (isPrice === false || isNumber === false) {
      return defaultTotal;
    }

    const price = parseFloat(pricePerHour);
    const number = parseFloat(numberOfHour);

    totalAmount = this.mathService.multiplyTwoDecimals(price, number);

    if (totalAmount !== totalAmount) {
      return defaultTotal;
    }

    return totalAmount;
  }

  public isLinksForMobile(): boolean {
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

  public openTermsOfUse(link: string): void {
    window.open(link, '_system', 'location=no');
  }
}
