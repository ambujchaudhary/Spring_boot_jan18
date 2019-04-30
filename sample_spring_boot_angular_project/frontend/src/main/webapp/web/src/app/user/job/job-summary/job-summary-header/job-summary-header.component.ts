import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Platform } from '@ionic/angular';
import { CallbackHandlerService } from '../../../../utils/callback-handler.service';
import { JobUtilsService } from '../../../../utils/job-utils.service';
import { MessagesService } from '../../../../utils/messages.service';
import { ToasterConfigService } from '../../../../utils/toaster-config.service';
import { AcceptOfferModalComponent } from '../../job-view/accept-offer-modal/accept-offer-modal.component';
import { CancelJobModalComponent } from '../../job-view/cancel-job-modal/cancel-job-modal.component';
import { DeclineOfferModalComponent } from '../../job-view/decline-offer-modal/decline-offer-modal.component';
import { JobOverview, JobStatusEnum, OwnershipTypeEnum } from '../../job.model';
import { JobService } from '../../job.service';

@Component({
  selector: 'zu-job-summary-header',
  templateUrl: './job-summary-header.component.html',
  styleUrls: ['./job-summary-header.component.scss']
})
export class JobSummaryHeaderComponent implements OnInit {
  @Input() job: JobOverview;

  public readonly ownershipTypeEnum = OwnershipTypeEnum;
  public readonly jobStatusEnum = JobStatusEnum;

  private currentUrl = window.location.origin.toString();
  private platform: Platform;

  constructor(private toaster: ToasterConfigService,
              private messagesService: MessagesService,
              private dialog: MatDialog,
              private jobService: JobService,
              private jobUtilsService: JobUtilsService,
              private callbackService: CallbackHandlerService,
              private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  ngOnInit() {
    if (typeof this.job.ownershipType === 'undefined') {
      this.job.ownershipType = OwnershipTypeEnum.OWNER;
    }
  }

  private acceptOffer() {
    this.job.status = this.jobStatusEnum.OFFER_ACCEPTED;
    this.jobService.acceptJobOffer(parseFloat(this.job.id)).subscribe(
        () => {
          this.messagesService.showSuccess('job.accept_offer.success');
        },
        () => {
          this.messagesService.showError('job.offer_error.message_error');
          this.job.status = this.jobStatusEnum.WAITING_FOR_RESPONSE;
        });
  }

  private declineOffer() {
    this.job.status = this.jobStatusEnum.NEW;
    this.jobService.declineJobOffer(parseFloat(this.job.id)).subscribe(
        () => {
          this.messagesService.showSuccess('job.decline_offer.success');
        },
        () => {
          this.messagesService.showError('job.offer_error.message_error');
          this.job.status = this.jobStatusEnum.WAITING_FOR_RESPONSE;
        });
  }

  private cancelJob(): void {
    this.jobService.cancelJob(parseInt(this.job.id, 10))
    .subscribe(
        () => {
          this.job.status = JobStatusEnum.CANCELLED;
          this.messagesService.showSuccess('cancel_job.canceling_success');
        },
        (error) => {
          this.job.status = JobStatusEnum.NEW;
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
  }

  public copyLink(): void {
    try {
      if (this.platform.is('mobile')) {
        this.jobUtilsService.copyLink('app.shootzu.com/job/' + this.job.id + '/view');
      } else {
        this.jobUtilsService.copyLink(this.currentUrl + '/job/' + this.job.id + '/view');
      }
    } catch (e) {
      this.jobUtilsService.copyLink(this.currentUrl + '/job/' + this.job.id + '/view');
    }
  }

  public showForType(...types: OwnershipTypeEnum[]): boolean {
    return types.some((value) => value === this.job.ownershipType);
  }

  public isNotPendingJob(jobStatus: JobStatusEnum): boolean {
    return jobStatus === JobStatusEnum.NEW || jobStatus === JobStatusEnum.WAITING_FOR_RESPONSE;
  }

  public isWaitingForResponseJob(jobStatus: JobStatusEnum): boolean {
    return jobStatus === JobStatusEnum.WAITING_FOR_RESPONSE;
  }

  public openAcceptOfferDialog(): void {
    const dialogRef = this.dialog.open(AcceptOfferModalComponent, {
      data: {
        job: this.job,
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.acceptOffer();
          }
        }
    );
  }

  public openDeclineOfferDialog(): void {
    const dialogRef = this.dialog.open(DeclineOfferModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.declineOffer();
          }
        }
    );
  }

  public openCancelJobModal(): void {
    const dialogRef = this.dialog.open(CancelJobModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.cancelJob();
          }
        }
    );
  }
}
