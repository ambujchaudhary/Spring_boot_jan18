import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Job, OwnershipTypeEnum } from '../../../user/job/job.model';
import { JobService } from '../../../user/job/job.service';
import { MessagesService } from '../../../utils/messages.service';

@Injectable({
  providedIn: 'root'
})
export class JobsManagementEditResolverService {

  constructor(
      private jobService: JobService,
      private messagesService: MessagesService,
      private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Job> | Promise<Job> | Job {
    const jobId = route.paramMap.get('id');
    return this.jobService.getJob(jobId)
    .catch(() => {
      this.messagesService.showError('job.job_does_not_exist');
      this.router.navigate(['/jobs-management']);
      return Observable.empty();
    })
    .do((job: Job) => {

      // Change ownership type to ADMIN, for changing permissions/routers for ADMIN in edit job components
      job.ownershipType = OwnershipTypeEnum.ADMIN;

      return job;
    });
  }
}
