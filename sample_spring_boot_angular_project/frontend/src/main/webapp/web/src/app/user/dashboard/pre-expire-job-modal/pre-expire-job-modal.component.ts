import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { MessagesService } from '../../../utils/messages.service';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';
import { PreExpireJobData } from '../../job/job.model';
import { JobService } from '../../job/job.service';

@Component({
  selector: 'zu-pre-expire-job-modal',
  templateUrl: './pre-expire-job-modal.component.html',
  styleUrls: ['./pre-expire-job-modal.component.scss']
})
export class PreExpireJobModalComponent {
  public preExpireJobData: PreExpireJobData;
  public isRequestInProgress = false;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private messagesService: MessagesService,
              private validationService: ValidationService,
              private toaster: ToasterConfigService,
              private localStorageService: LocalStorageService,
              private jobService: JobService,
              private callbackService: CallbackHandlerService) {

    if (data !== null) {
      this.preExpireJobData = data.expiringJobDetails;
    }
  }

  private updateLocalStorage(): void {
    const remainJobs = this.localStorageService.getObject<PreExpireJobData[]>('preExpireJobModalData');
    remainJobs.shift();

    if (remainJobs.length !== 0) {
      this.localStorageService.setObject('preExpireJobModalData', remainJobs);
    } else {
      this.localStorageService.delete('preExpireJobModalData');
    }
  }

  private handleError(error, errorMessage: string, errorCode: string): void {
    this.isRequestInProgress = false;

    if (error.error.message = errorMessage) {
      this.messagesService.showError(errorCode);
      this.updateLocalStorageAndClose();
    } else {
      this.toaster.error(this.callbackService.getErrorMessage(error));
    }
  }

  public updateLocalStorageAndClose(): void {
    this.updateLocalStorage();
    this.dialogRef.close();
  }

  public renewJob(): void {
    this.isRequestInProgress = true;
    this.jobService.renewJob(parseInt(this.preExpireJobData.id, 10))
    .subscribe(
        () => {
          this.messagesService.showSuccess('renew_job.renewing_success');
          this.updateLocalStorageAndClose();
        },
        (error) => {
          this.handleError(error, 'renew_job.cant_renew', 'renew_job.cant_renew');
        });
  }

  public cancelJob(): void {
    this.isRequestInProgress = true;
    this.jobService.cancelJob(parseInt(this.preExpireJobData.id, 10))
    .subscribe(
        () => {
          this.messagesService.showSuccess('cancel_job.canceling_success');
          this.updateLocalStorageAndClose();
        },
        (error) => {
          this.handleError(error, 'This job already canceled', 'job.job_already_canceled.message_error');
        });
  }

  public getJobUrl(): string {
    return `/job/${this.preExpireJobData.id}/view`;
  }
}
