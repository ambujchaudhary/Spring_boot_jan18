import { Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AdminService } from '../../admin/admin.service';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { JobUtilsService } from '../../utils/job-utils.service';
import { MessagesService } from '../../utils/messages.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { Job, JobStatusEnum, OwnershipTypeEnum } from '../../user/job/job.model';
import { JobService } from '../../user/job/job.service';
import { CancelJobModalComponent } from '../../user/job/job-view/cancel-job-modal/cancel-job-modal.component';

@Component({
  selector: 'zu-job-view-header-buttons',
  templateUrl: './job-view-header-buttons.component.html',
  styleUrls: ['./job-view-header-buttons.component.scss']
})
export class JobViewHeaderButtonsComponent implements OnInit {
  @Input() ownershipType: OwnershipTypeEnum;
  @Input() job: Job;

  public tooltipPosition = 'below';
  public editTooltipMessage = 'Edit job offer';
  public copyLinkTooltipMessage = 'Copy shareable link';
  public askQuestionTooltipMessage = 'Contact support';
  public cancelOfferTooltipMessage = 'Cancel job';
  public jobId: string;

  public readonly ownershipTypeEnum = OwnershipTypeEnum;
  public readonly jobStatusEnum = JobStatusEnum;

  private currentUrl = window.location.toString();
  private platform: Platform;

  constructor(private route: ActivatedRoute,
              private jobUtilsService: JobUtilsService,
              private dialog: MatDialog,
              private jobService: JobService,
              private toaster: ToasterConfigService,
              private messagesService: MessagesService,
              private callbackService: CallbackHandlerService,
              private injector: Injector,
              private adminService: AdminService
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {}
  }

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
  }

  public copyLink() {
    try {
      if (this.platform.is('mobile')) {
        this.jobUtilsService.copyLink('app.shootzu.com/job/' + this.jobId + '/view');
      } else {
        this.jobUtilsService.copyLink(this.currentUrl);
      }
    } catch (e) {
      this.jobUtilsService.copyLink(this.currentUrl);
    }
  }

  public isCancelButtonHidden(): boolean {
    return (this.ownershipType === this.ownershipTypeEnum.OWNER &&
           (this.job.status === this.jobStatusEnum.NEW || this.job.status === this.jobStatusEnum.WAITING_FOR_RESPONSE)) ||
           (this.ownershipType === this.ownershipTypeEnum.ADMIN && this.job.status === this.jobStatusEnum.COMPLETED);
  }

  public openCancelJobModal(): void {
    const dialogRef = this.dialog.open(CancelJobModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.ownershipType === this.ownershipTypeEnum.ADMIN ? this.closeJob() : this.cancelJob();
          }
        }
    );
  }

  private cancelJob(): void {
    this.jobService.cancelJob(parseInt(this.jobId, 10))
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

  public getJobEditRedirectLink(): string {
    if (this.job.ownershipType === this.ownershipTypeEnum.ADMIN) {
      return `/job-management/${this.jobId}/edit`;
    } else return `/job/${this.jobId}`;
  }

  // Close job for Admin
  private closeJob(): void {
    this.adminService.closeJob(parseInt(this.jobId, 10)).subscribe(
        () => {
          this.job.status = JobStatusEnum.CANCELLED;
          this.messagesService.showSuccess('complete_job.job_closed.message_success');
        },
        () => {
          this.messagesService.showError('common.message_error');
        }
    );
  }

  public openIntercom(): void {
    (<any>window).Intercom('show');
  }
}
