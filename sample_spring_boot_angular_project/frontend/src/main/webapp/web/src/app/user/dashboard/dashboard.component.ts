import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { PreExpireJobData } from '../job/job.model';
import { JobDataForFeedback } from '../user.model';
import { AutocompleteJobModalComponent } from './autocomplete-job-modal/autocomplete-job-modal.component';
import { DashboardStatisticsTypeEnum } from './dashboard.model';
import { PreExpireJobModalComponent } from './pre-expire-job-modal/pre-expire-job-modal.component';
import { ShooterFeedbackModalComponent } from './shooter-feedback-modal/shooter-feedback-modal.component';

@Component({
  selector: 'zu-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Input() mobile = false;

  public readonly dashboardStatisticsTypeEnum = DashboardStatisticsTypeEnum;

  private shooterFeedback: JobDataForFeedback;
  private autoCompleteJobData: JobDataForFeedback;
  private preExpireJobData: PreExpireJobData;

  constructor(
      private localStorageService: LocalStorageService,
      private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    Promise.resolve().then(() => {
      this.checkForModalNeeded();
    });
  }

  private checkForModalNeeded(): void {
    const feedbackNeeded = this.localStorageService.getObject<JobDataForFeedback[]>('feedbackModalData');
    const preExpireJob = this.localStorageService.getObject<PreExpireJobData[]>('preExpireJobModalData');
    const autoCompleteJob = this.localStorageService.getObject<JobDataForFeedback[]>('autocompleteModalData');

    if (feedbackNeeded !== null && Array.isArray(feedbackNeeded) && feedbackNeeded.length > 0) {
      this.shooterFeedback = feedbackNeeded[0];
      this.openShooterFeedbackWindow();
    } else if (autoCompleteJob !== null && Array.isArray(autoCompleteJob) && autoCompleteJob.length > 0) {
      this.autoCompleteJobData = autoCompleteJob[0];
      this.openAutoCompleteJobWindow();
    } else if (preExpireJob !== null && Array.isArray(preExpireJob) && preExpireJob.length > 0) {
      this.preExpireJobData = preExpireJob[0];
      this.openPreExpireJobWindow();
    }
  }

  private openShooterFeedbackWindow(): void {
    const dialogRef = this.dialog.open(ShooterFeedbackModalComponent, {
      disableClose: true,
      data: {
        completedJobDetails: this.shooterFeedback
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.checkForModalNeeded();
    });
  }

  private openPreExpireJobWindow(): void {
    const dialogRef = this.dialog.open(PreExpireJobModalComponent, {
      disableClose: true,
      data: {
        expiringJobDetails: this.preExpireJobData
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.checkForModalNeeded();
    });
  }

  private openAutoCompleteJobWindow(): void {
    const dialogRef = this.dialog.open(AutocompleteJobModalComponent, {
      disableClose: true,
      data: {
        autocompleteJobDetails: this.autoCompleteJobData
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.checkForModalNeeded();
    });
  }
}
