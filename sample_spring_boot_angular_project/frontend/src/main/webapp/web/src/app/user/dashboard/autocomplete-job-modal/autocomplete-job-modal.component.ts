import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { JobUtilsService } from '../../../utils/job-utils.service';
import { MessagesService } from '../../../utils/messages.service';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';
import { JobReport } from '../../job/job.model';
import { JobDataForFeedback } from '../../user.model';
import { UserService } from '../../user.service';

@Component({
  selector: 'zu-autocomplete-job-modal',
  templateUrl: './autocomplete-job-modal.component.html',
  styleUrls: ['./autocomplete-job-modal.component.scss']
})
export class AutocompleteJobModalComponent {

  public autocompleteJobData: JobDataForFeedback;
  public rate: number;
  public review: string;
  public reviewMaxLength = 5000;

  private jobReport: JobReport;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private messagesService: MessagesService,
              private validationService: ValidationService,
              private toaster: ToasterConfigService,
              private localStorageService: LocalStorageService,
              private userService: UserService,
              private jobUtilsService: JobUtilsService) {

    if (data !== null) {
      this.autocompleteJobData = data.autocompleteJobDetails;
    }

    this.rate = 0;
    this.jobReport = new JobReport();
  }

  private updateLocalStorageAfterSuccess(): void {
    const remainJobs = this.localStorageService.getObject<JobDataForFeedback[]>('autocompleteModalData');
    remainJobs.shift();

    if (remainJobs.length !== 0) {
      this.localStorageService.setObject('autocompleteModalData', remainJobs);
    } else {
      this.localStorageService.delete('autocompleteModalData');
    }
  }

  private fillDataForFeedback(): void {
    this.jobReport.review = this.review;
    this.jobReport.star = this.jobUtilsService.getStarsByValue(this.rate);
  }

  public sendFeedback(): void {
    if (this.jobUtilsService.jobFeedbackValidation(this.rate, this.review) === false) {
      return;
    }

    this.fillDataForFeedback();

    this.userService.leaveFeedbackAsBusiness(this.jobReport, this.autocompleteJobData.id)
    .subscribe(
        () => {
          this.messagesService.showSuccess('common.feedback_send.message_success');
          this.updateLocalStorageAfterSuccess();
          this.dialogRef.close();
        },
        (error) => {
          if (error.error.message = 'You already created feedback for this user') {
            this.messagesService.showError('common.feedback_already_created.message_error');
            this.updateLocalStorageAfterSuccess();
            this.dialogRef.close();
          } else {
            this.messagesService.showError('common.message_error');
          }
        }
    );
  }
}
