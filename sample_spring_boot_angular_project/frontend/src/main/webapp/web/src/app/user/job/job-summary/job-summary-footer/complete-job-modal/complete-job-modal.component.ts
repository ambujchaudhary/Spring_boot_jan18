import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../../../../shared/modal-dialog/modal-dialog.component';
import { JobUtilsService } from '../../../../../utils/job-utils.service';
import { MessagesService } from '../../../../../utils/messages.service';
import { ToasterConfigService } from '../../../../../utils/toaster-config.service';
import { ValidationService } from '../../../../../utils/validation.service';
import { JobDetailsForModal } from '../../../job.model';
import { JobService } from '../../../job.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'zu-complete-job-modal',
  templateUrl: './complete-job-modal.component.html',
  styleUrls: ['./complete-job-modal.component.scss']
})
export class CompleteJobModalComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  public jobId: number;
  public jobDetails: JobDetailsForModal;
  public review: string;
  public rate: number;
  public reviewMaxLength = 5000;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private jobService: JobService,
              private messagesService: MessagesService,
              private validationService: ValidationService,
              private toaster: ToasterConfigService,
              private jobUtilsService: JobUtilsService) {

    if (data !== null) {
      this.jobId = data.id;
    }
  }

  ngOnInit() {
    this.getJobDetails();
    this.rate = 0;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private getJobDetails(): void {
    this.jobService.getJobDetails(this.jobId).subscribe(
        (data) => {
          this.jobDetails = data;
        },
        () => {
          this.messagesService.showError('complete_job.complete_success');
        });
  }

  public completeJob(): void {
    if (this.jobUtilsService.jobFeedbackValidation(this.rate, this.review) === false) {
      return;
    }

    this.dialogRef.close({
      result: true,
      review: this.review,
      rate: this.rate,
    });
  }
}
