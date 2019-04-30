import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job, OwnershipTypeEnum } from '../../../user/job/job.model';
import { JobService } from '../../../user/job/job.service';
import { UploadedFile } from '../../../user/user.model';
import { MathService } from '../../../utils/math.service';
import { MessagesService } from '../../../utils/messages.service';
import { ValidationService } from '../../../utils/validation.service';

@Component({
  selector: 'zu-jobs-management-view',
  templateUrl: './jobs-management-view.component.html',
  styleUrls: ['./jobs-management-view.component.scss']
})
export class JobsManagementViewComponent implements OnInit {

  public jobView: Job;
  public uploadedFiles;

  public readonly ownershipTypeEnum = OwnershipTypeEnum;

  private jobId = this.route.snapshot.params['id'];

  constructor(
      private jobService: JobService,
      private messagesService: MessagesService,
      private route: ActivatedRoute,
      private validationService: ValidationService,
      private mathService: MathService
  ) { }

  ngOnInit() {
    this.getJob();
  }

  private getJob (): void {
    this.jobService.getJob(this.jobId)
    .subscribe((data) => {
      this.jobView = data;

      // Change ownership type to ADMIN, for changing permissions for ADMIN in view job components
      this.jobView.ownershipType = OwnershipTypeEnum.ADMIN;

      const tmpUploadedFiles = Array.prototype.map.call(this.jobView.attachment, (file) => {
        const tmpFile = Object.assign({}, file);
        UploadedFile.setClientSideData(tmpFile);

        return tmpFile;
      });
      this.uploadedFiles = tmpUploadedFiles as UploadedFile[];
    });
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

}
