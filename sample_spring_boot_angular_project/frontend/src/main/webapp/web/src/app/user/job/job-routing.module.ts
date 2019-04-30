import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../user.guard';
import { JobViewResolverService } from './job-view/job-view-resolver.service';
import { JobViewComponent } from './job-view/job-view.component';
import { JobsComponent } from './jobs/jobs.component';
import { PostJobResolverService } from '../../shared/post-job/post-job-resolver.service';
import { PostJobComponent } from '../../shared/post-job/post-job.component';
import { FindJobComponent } from './find-job/find-job.component';

const authRoutes: Routes = [
  {
    path: 'jobs',
    component: JobsComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
  },
  {
    path: 'job',
    component: PostJobComponent,
    pathMatch: 'full',
    canActivate: [UserGuard],
    canLoad: [UserGuard],
  },
  {
    path: 'job/:id',
    component: PostJobComponent,
    pathMatch: 'full',
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    resolve: {
      job: PostJobResolverService
    }
  },
  {
    path: 'job/:id/view',
    component: JobViewComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    resolve: {
      jobViewData: JobViewResolverService
    }
  },
  {
    path: 'find-job',
    component: FindJobComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class JobRoutingModule {
}
