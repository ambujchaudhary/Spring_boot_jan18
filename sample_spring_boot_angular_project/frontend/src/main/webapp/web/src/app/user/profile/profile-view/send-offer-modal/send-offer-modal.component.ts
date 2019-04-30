import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ModalDialogComponent } from '../../../../shared/modal-dialog/modal-dialog.component';
import { MathService } from '../../../../utils/math.service';
import { ToasterConfigService } from '../../../../utils/toaster-config.service';
import { Job } from '../../../job/job.model';
import * as moment from 'moment';

declare var stripe;

@Component({
  selector: 'zu-send-offer-modal',
  templateUrl: './send-offer-modal.component.html',
  styleUrls: ['./send-offer-modal.component.scss']
})
export class SendOfferModalComponent implements OnInit, OnDestroy {
  @ViewChild('cardInfo') set content(content: ElementRef) {
    if (content) {
      this.setStyleAndEventForCard(content);
    }
  }

  public name: string;
  public job: Job;
  public card: any;
  public cardHandler = this.onChange.bind(this);
  public cardError: string | null;
  public isStripePayment: boolean;
  public selectedPayment: string;
  public totalAmount: number;
  public isRequestInProgress = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private mathService: MathService,
              private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private toaster: ToasterConfigService) {

    if (data) {
      this.name = data.name;
      this.job = data.jobDetails;
    }
  }

  ngOnInit() {}

  private setStyleAndEventForCard(cardInfo: ElementRef) {
    const style = {
      base: {
        fontWeight: 300,
        fontFamily: 'SF-Light, SF-Normal, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':focus': {
          color: '#00011C',
        },

        '::placeholder': {
          color: '#BEC1C4',
        },

        ':focus::placeholder': {},
      },
      invalid: {
        ':focus': {
          color: '#FF8787',
        },
        '::placeholder': {
          color: '#FF8787',
        },
      },
    };
    const elements = stripe.elements();
    this.card = elements.create('card', {style});
    this.card.mount(cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
    }
  }

  onChange({error}) {

    console.log('onChange', error);
    if (typeof error !== 'undefined') {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.changeDetectorRef.detectChanges();
  }

  public checkIsStripeOnly() {
    const today = moment();
    return this.job.date && moment(this.job.date).subtract(14, 'days').isBefore(today);
  }

  public getPaymentInfoDate() {
    return moment(this.job.date).subtract(14, 'days');
  }

  public closeModal() {
    this.dialogRef.close();
  }

  public goBack() {
    this.isStripePayment = false;
  }

  public calcTotal() {
    let totalAmount: number;
    const price = parseFloat(this.job.pricePerHour);
    const number = parseFloat(this.job.numberOfHour);

    totalAmount = this.mathService.multiplyTwoDecimals(price, number);
    return totalAmount;
  }

  public calcPayment(paymentType) {
    let totalAmount: number;
    let percent: number;
    const price = parseFloat(this.job.pricePerHour);
    const number = parseFloat(this.job.numberOfHour);
    const totalCurrency = this.mathService.multiplyTwoDecimals(price, number);
    const halfTotalCurrency = this.mathService.multiplyTwoDecimals(totalCurrency, 0.5);

    switch (paymentType) {
      case 'stripe':
        percent = this.mathService.addTwoDecimals(halfTotalCurrency, 0.3);
        totalAmount = this.mathService.divideTwoDecimals(percent, 0.971, 3);
        totalAmount = this.mathService.changePrecision(totalAmount, 2);
        break;

      case 'gocardless':
        percent = this.mathService.multiplyTwoDecimals(halfTotalCurrency, 0.01);
        if (percent < 0.35) {
          percent = 0.35;
        } else if (percent > 3.5) {
          percent = 3.5;
        }
        totalAmount = halfTotalCurrency + percent;
        break;

        // only for 14< days left
      case 'stripe1':
        percent = this.mathService.addTwoDecimals(totalCurrency, 0.3);
        totalAmount = this.mathService.divideTwoDecimals(percent, 0.971, 3);
        totalAmount = this.mathService.changePrecision(totalAmount, 2);
        break;
      default:
        break;
    }

    return totalAmount;
  }

  public selectMethod(method: string) {
    this.selectedPayment = method;
    this.totalAmount = this.calcPayment(method) || 0;
  }

  public async onSendOffer() {
    this.isRequestInProgress = true;

    const {token, error} = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
      this.isRequestInProgress = false;
    } else {
      console.log('all is ok', token);
      this.dialogRef.close({methodType: this.selectedPayment, token: token.id, isStripeOnly: this.checkIsStripeOnly()});
    }
  }

  public onContinue() {
    if (this.selectedPayment) {
      if (this.selectedPayment === 'stripe') {
        this.isStripePayment = true;
      } else {
        this.dialogRef.close({methodType: this.selectedPayment});
      }
    } else {
      this.toaster.error('Please, choose a payment method');
    }
  }
}
