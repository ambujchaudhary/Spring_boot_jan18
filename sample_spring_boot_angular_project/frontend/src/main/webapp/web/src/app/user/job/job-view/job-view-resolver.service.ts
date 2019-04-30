import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { zip } from 'rxjs/internal/observable/zip';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';
import { MessagesService } from '../../../utils/messages.service';
import { JobStatusEnum, JobViewResolver, OwnershipTypeEnum } from '../job.model';
import { JobService } from '../job.service';

@Injectable({
  providedIn: 'root'
})
export class JobViewResolverService {

  constructor(
      private jobService: JobService,
      private router: Router,
      private messagesService: MessagesService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<JobViewResolver> | Promise<JobViewResolver> | JobViewResolver {
    const jobId = route.paramMap.get('id');

    const first$ = this.jobService.getNames().catch((e) => {
      console.log('first$ catch', e);
      return Observable.empty();
    }).pipe(first());

    const second$ = this.jobService.getJob(jobId).catch((e) => {
      console.log('second$ catch', e);
      this.messagesService.showError('job.job_does_not_exist');
      this.router.navigate(['/find-job']);
      return Observable.empty();
    }).pipe(first());

    return zip(first$, second$).pipe(map((arr) => {
      const [profileNames, job] = arr;

      if (job.status !== JobStatusEnum.NEW && job.status !== JobStatusEnum.WAITING_FOR_RESPONSE) {
        if (job.ownershipType !== OwnershipTypeEnum.OWNER && job.ownershipType !== OwnershipTypeEnum.SHOOTER) {
          this.messagesService.showError('job.job_does_not_exist');
          this.router.navigate(['/find-job']);
          return null;
        }
      }

      return {job, profileNames};
    }));
  }

}
