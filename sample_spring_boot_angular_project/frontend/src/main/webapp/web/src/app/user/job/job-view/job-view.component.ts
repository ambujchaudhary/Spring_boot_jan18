import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { MathService } from '../../../utils/math.service';
import { MessagesService } from '../../../utils/messages.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';
import { UploadedFile } from '../../user.model';
import { Job, JobStatusEnum, JobViewResolver, OwnershipTypeEnum } from '../job.model';
import { JobService } from '../job.service';
import { CancelJobModalComponent } from './cancel-job-modal/cancel-job-modal.component';
import { RenewJobModalComponent } from './renew-job-modal/renew-job-modal.component';

import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'zu-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss']
})
export class JobViewComponent implements OnInit, OnDestroy {

  public jobView: Job;
  public profileNames;
  public uploadedFiles;
  public isRequestInProgress = false;

  private currentDate = moment();
  private jobId = this.route.snapshot.params['id'];

  public readonly ownershipTypeEnum = OwnershipTypeEnum;
  public readonly jobStatusEnum = JobStatusEnum;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private jobService: JobService,
              private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private validationService: ValidationService,
              private mathService: MathService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.getJob();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private getJob(): void {
    this.route.data.subscribe((data: {jobViewData: JobViewResolver}) => {
      this.profileNames = data.jobViewData.profileNames;
      this.jobView = data.jobViewData.job;

      const tmpUploadedFiles = Array.prototype.map.call(this.jobView.attachment, (file) => {
        const tmpFile = Object.assign({}, file);
        UploadedFile.setClientSideData(tmpFile);

        return tmpFile;
      });
      this.uploadedFiles = tmpUploadedFiles as UploadedFile[];
    });
  }

  private renewJob(): void {
    this.isRequestInProgress = true;
    this.jobService.renewJob(this.jobId)
    .subscribe(
        () => {
          this.jobView.lastAction = this.currentDate.toString();
          this.messagesService.showSuccess('renew_job.renewing_success');
        },
        (error) => {
          this.isRequestInProgress = false;
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
  }

  private cancelJob(): void {
    this.isRequestInProgress = true;
    this.jobService.cancelJob(this.jobId)
    .subscribe(
        () => {
          this.jobView.status = JobStatusEnum.CANCELLED;
          this.messagesService.showSuccess('cancel_job.canceling_success');
        },
        (error) => {
          this.jobView.status = JobStatusEnum.NEW;
          this.isRequestInProgress = false;
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
  }

  public calcExpireDays(): number {
    const daysDiff = this.currentDate.diff(this.jobView.lastAction, 'days');
    return daysDiff;
  }

  public isJobAboutExpire(): boolean {
    let result = false;
    if (this.calcExpireDays() >= 23 && this.calcExpireDays() < 30) {
      result = true;
    }

    return result;
  }

  public showDaysToExpire(): string {
    return `Your job will expire in ${30 - this.calcExpireDays()} days. You can:`;
  }

  public calcTotalAmount(): number {
    let totalAmount: number;
    const defaultTotal = 0;

    const {pricePerHour, numberOfHour} = this.jobView;
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

  public changeOwnershipType(): void {
    this.jobView.ownershipType = OwnershipTypeEnum.APPLICANT;
  }

  public getIntroHeaderTitle(): string {
    const {ownershipType = ''} = this.jobView || new Job();

    if (this.validationService.isStringNotEmpty(ownershipType) === false) {
      return '';
    }

    switch (ownershipType) {
      case OwnershipTypeEnum.CHOSEN_APPLICANT:
        return 'JOB OFFER DETAILS';
      case OwnershipTypeEnum.OWNER:
      case OwnershipTypeEnum.SHOOTER:
      default:
        return 'JOB DETAILS';
    }
  }

  public openRenewJobModal() {
    const dialogRef = this.dialog.open(RenewJobModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.renewJob();
          }
        }
    );
  }

  public openCancelJobModal() {
    const dialogRef = this.dialog.open(CancelJobModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.cancelJob();
          }
        }
    );
  }

  public updateJobAfterEmitter(): void {
    this.jobService.getJob(this.jobId).subscribe(
        (data) => {
          this.jobView = data;
        },
        () => {
          this.messagesService.showError('common.message_error');
        }
    );
  }
}
