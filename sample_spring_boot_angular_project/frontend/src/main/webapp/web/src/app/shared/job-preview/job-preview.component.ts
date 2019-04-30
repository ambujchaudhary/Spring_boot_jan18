import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job, OwnerNameEnum, OwnershipTypeEnum } from '../../user/job/job.model';
import { UploadedFile } from '../../user/user.model';
import { BusinessAndPersonalNames } from '../../auth/auth.model';

@Component({
  selector: 'zu-job-preview',
  templateUrl: './job-preview.component.html',
  styleUrls: ['./job-preview.component.scss'],
})
export class JobPreviewComponent implements AfterViewInit {

  @Input() job: Job;
  @Input() profileNames: BusinessAndPersonalNames;
  @Input() attachments: UploadedFile[];
  @Input() totalAmount: number;
  @Input() isApplicantsSectionVisible = false;

  public readonly OwnershipTypeEnum = OwnershipTypeEnum;
  public readonly OwnerNameEnum = OwnerNameEnum;

  private static isUploadtedAttachment(item: UploadedFile): boolean {
    return item.isInvalid === false && item.isLoading === false && (item.fullName || '').length > 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {this.checkQueryParams(); }, 50);
  }

  constructor(private route: ActivatedRoute) {}

  private checkQueryParams() {
    if (typeof this.route.snapshot.queryParams['applicants'] !== 'undefined') {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  }

  public getFillAttachments() {
    const newAttachments = this.attachments || [];

    return Array.prototype.filter.call(newAttachments, JobPreviewComponent.isUploadtedAttachment);
  }

  public getOwnerName(): string {
    if (this.job.ownerName === '') {
      return '';
    } else if (typeof this.job.ownerName !== 'undefined') {
      return `by ${this.job.ownerName}`;
    } else {
      const owner = this.job.ownerType;
      let result: string;

      switch (owner) {
        case OwnerNameEnum.BUSINESS_NAME:
          result = this.profileNames.businessName;
          break;
        case OwnerNameEnum.PERSONAL_NAME:
        default:
          result = this.profileNames.personalName;
      }

      return `by ${result}`;
    }
  }

  public getOwnerId(): string {
    if (this.job.ownershipType === this.OwnershipTypeEnum.ADMIN) {
      return this.job.ownerId;
    } else return this.job.ownerProfileId;
  }
}
