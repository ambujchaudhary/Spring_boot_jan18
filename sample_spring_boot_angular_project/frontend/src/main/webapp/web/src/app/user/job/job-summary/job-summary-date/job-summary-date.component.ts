import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { JobStatusEnum, LabelTypeEnum, OwnershipTypeEnum } from '../../job.model';

@Component({
  selector: 'zu-job-summary-date',
  templateUrl: './job-summary-date.component.html',
  styleUrls: ['./job-summary-date.component.scss']
})
export class JobSummaryDateComponent implements OnInit {

  // TODO change type!
  @Input() date: string;
  @Input() daysToExpire: number;
  @Input() status: JobStatusEnum;
  @Input() ownershipType: OwnershipTypeEnum;

  public labelType: LabelTypeEnum;

  public readonly jobStatusEnum = JobStatusEnum;
  public readonly ownershipTypeEnum = OwnershipTypeEnum;

  ngOnInit() {
    this.getLabelType();
  }

  public calcDateDiff(): string {
    const today = moment().format('YYYY-MM-DD');
    const diff = moment(this.date).diff(today, 'days');

    if (diff < 0) {
      return `${Math.abs(diff)} day(s) after job was started`;
    } else {
      return `${diff} day(s) until job`;
    }
  }

  private showExpireDaysLabel(): boolean {
    return this.daysToExpire <= 7 && this.daysToExpire > 0 && this.status === this.jobStatusEnum.NEW && this.ownershipType ===
           this.ownershipTypeEnum.OWNER;
  }

  private showJobCancelledLabel(): boolean {
    return this.status === this.jobStatusEnum.CANCELLED && this.ownershipType === this.ownershipTypeEnum.OWNER;
  }

  private showJobCompletedLabel(): boolean {
    return this.status === this.jobStatusEnum.COMPLETED &&
           (this.ownershipType === this.ownershipTypeEnum.OWNER || this.ownershipType === this.ownershipTypeEnum.SHOOTER);
  }

  private showJobDoneLabel(): boolean {
    return this.status === this.jobStatusEnum.DONE &&
           (this.ownershipType === this.ownershipTypeEnum.OWNER || this.ownershipType === this.ownershipTypeEnum.SHOOTER);
  }

  private showDeclinedJobLabel(): boolean {
    return this.ownershipType === this.ownershipTypeEnum.OFFER_DECLINED;
  }

  private getLabelType(): void {
    if (this.showJobCancelledLabel()) {
      this.labelType = LabelTypeEnum.CANCELLED;
    } else if (this.showJobCompletedLabel()) {
      this.labelType = LabelTypeEnum.COMPLETED;
    } else if (this.showExpireDaysLabel()) {
      this.labelType = LabelTypeEnum.EXPIRING;
    } else if (this.showJobDoneLabel()) {
      this.labelType = LabelTypeEnum.DONE;
    } else if (this.showDeclinedJobLabel()) {
      this.labelType = LabelTypeEnum.DECLINED;
    } else {
      this.labelType = LabelTypeEnum.DEFAULT;
    }
  }

  public setLabelText(): string {
    if (this.labelType === LabelTypeEnum.COMPLETED) {
      return 'Job Completed';
    } else if (this.labelType === LabelTypeEnum.EXPIRING) {
      return `Expire in ${this.daysToExpire} days`;
    } else if (this.labelType === LabelTypeEnum.CANCELLED) {
      return 'Job Cancelled';
    } else if (this.labelType === LabelTypeEnum.DONE) {
      return 'Job Done';
    } else if (this.labelType === LabelTypeEnum.DECLINED) {
      return 'Job Declined';
    } else {
      return this.calcDateDiff();
    }
  }

  public setLabelStyle(): string {
    if (this.labelType === LabelTypeEnum.COMPLETED || this.labelType === LabelTypeEnum.DONE) {
      return 'job-status-label completed-label';
    } else if (this.labelType === LabelTypeEnum.EXPIRING) {
      return 'job-status-label expire-label';
    } else if (this.labelType === LabelTypeEnum.CANCELLED || this.labelType === LabelTypeEnum.DECLINED) {
      return 'job-status-label expire-label';
    } else {
      return 'date-label';
    }
  }
}
