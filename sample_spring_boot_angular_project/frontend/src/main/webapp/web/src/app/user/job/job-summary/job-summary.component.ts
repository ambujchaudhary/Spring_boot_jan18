import { Component, Input } from '@angular/core';
import { MathService } from '../../../utils/math.service';
import { JobOverview, OwnershipTypeEnum } from '../job.model';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'zu-job-summary',
  templateUrl: './job-summary.component.html',
  styleUrls: ['./job-summary.component.scss']
})
export class JobSummaryComponent {

  public readonly ownershipTypeEnum = OwnershipTypeEnum;
  private currentDate = moment();

  @Input() job: JobOverview;
  @Input() ownershipType: OwnershipTypeEnum;
  @Input() hideApplicants: boolean;
  @Input() active = false;
  @Input() askQuestion: boolean;
  @Input() ownerActiveJobButtons: boolean;

  constructor(private mathService: MathService) {}

  public calcTotal() {
    let totalAmount: number;
    const price = parseFloat(this.job.pricePerHour);
    const number = parseFloat(this.job.numberOfHour);

    totalAmount = this.mathService.multiplyTwoDecimals(price, number);
    return totalAmount;
  }

  private calcExpireDays(): number {
    const daysDiff = this.currentDate.diff(this.job.lastAction, 'days');
    return daysDiff;
  }

  public calcDaysToExpire(): number {
    return 30 - this.calcExpireDays();
  }
}
