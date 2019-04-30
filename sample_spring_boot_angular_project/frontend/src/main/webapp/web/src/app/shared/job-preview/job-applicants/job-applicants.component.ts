import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { Job, JobApplicants, OwnershipTypeEnum } from '../../../user/job/job.model';
import { JobService } from '../../../user/job/job.service';

@Component({
  selector: 'zu-job-applicants',
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss']
})
export class JobApplicantsComponent {

  @Input() jobView: Job;

  public readonly OwnershipTypeEnum = OwnershipTypeEnum;

  public isRequestInProgress = false;
  public tooltipText = 'Mark as good candidate';
  public jobId = this.route.snapshot.params['id'];

  constructor(private jobService: JobService,
              private route: ActivatedRoute,
              private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private router: Router) { }

  public chooseApplicant(event: MouseEvent, applicant: JobApplicants): boolean {
    applicant.inProgress = true;
    this.jobService.markApplicant(this.jobId, applicant.id).finally(
        () => applicant.inProgress = false)
    .subscribe(
        () => {
          applicant.marked = !applicant.marked;
        },
        (error) => {
          //        TODO  CHANGE TO MESSAGE SERVICE
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });

    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  public isShooter(applicant: JobApplicants): string {
    if (applicant.hired === true) {
      return 'label-shooter-color';
    }
  }

  public navigateToApplicant(applicant: JobApplicants): void {
    if (this.jobView.ownershipType === this.OwnershipTypeEnum.ADMIN) {
      this.router.navigate(['/admin/user-profile', applicant.id]);
    } else {
      this.router.navigate(['/profile', applicant.profileId], {queryParams: {jobId: this.jobId}});
    }
  }
}
