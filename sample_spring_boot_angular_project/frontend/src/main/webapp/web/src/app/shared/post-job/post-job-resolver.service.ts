import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MessagesService } from '../../utils/messages.service';
import { Job, JobStatusEnum, OwnershipTypeEnum } from '../../user/job/job.model';
import { JobService } from '../../user/job/job.service';

@Injectable({
  providedIn: 'root'
})
export class PostJobResolverService {

  constructor(
      private jobService: JobService,
      private router: Router,
      private messagesService: MessagesService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Job> | Promise<Job> | Job {
    const jobId = route.paramMap.get('id');
    return this.jobService.getJob(jobId)
    .catch(() => {
      this.messagesService.showError('job.job_does_not_exist');
      this.router.navigate(['/jobs']);
      return Observable.empty();
    })
    .do((job: Job) => {
      if (job.ownershipType !== OwnershipTypeEnum.OWNER) {
        this.router.navigate(['/job', jobId, 'view']);
        return Observable.empty();
      } else if (job.status !== JobStatusEnum.NEW && job.status !== JobStatusEnum.WAITING_FOR_RESPONSE) {
        this.messagesService.showError('job.accepted_job_can_not_edited');
        this.router.navigate(['/job', jobId, 'view']);
      }

      return job;
    });
  }
}
