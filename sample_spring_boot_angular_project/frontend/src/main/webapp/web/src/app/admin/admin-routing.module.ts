import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { AdminGuard } from './admin.guard';
import { JobsManagementEditResolverService } from './jobs-management/jobs-management-edit/jobs-management-edit-resolver.service';
import { JobsManagementEditComponent } from './jobs-management/jobs-management-edit/jobs-management-edit.component';
import { JobsManagementViewComponent } from './jobs-management/jobs-management-view/jobs-management-view.component';
import { JobsManagementComponent } from './jobs-management/jobs-management.component';
import { UserProfileEditComponent } from './user-profile/user-profile-edit/user-profile-edit.component';

// others
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const adminRoutes: Routes = [
  {
    path: 'admin/user-profile/:id',
    component: UserProfileComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  }, {
    path: 'admin-reports',
    component: AdminReportsComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  }, {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  }, {
    path: 'job-management',
    component: JobsManagementComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  }, {
    path: 'job-management/:id/view',
    component: JobsManagementViewComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard]
  }, {
    path: 'job-management/:id/edit',
    component: JobsManagementEditComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
    resolve: {
      job: JobsManagementEditResolverService
    }
  }, {
    path: 'admin/user-profile/:id/edit',
    component: UserProfileEditComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],

  exports: [RouterModule],
})
export class AdminRoutingModule {
}
