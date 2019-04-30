import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../../../../web/src/app/admin/admin.guard';
import { JobsManagementEditResolverService } from '../../../../web/src/app/admin/jobs-management/jobs-management-edit/jobs-management-edit-resolver.service';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: './admin-dashboard-mobile/admin-dashboard-mobile.module#AdminDashboardMobilePageModule',
    canLoad: [AdminGuard],
  },
  {
    path: 'job-management',
    loadChildren: './job-management-mobile/job-management-mobile.module#JobManagementMobilePageModule',
    canLoad: [AdminGuard],
  },
  {
    path: 'job-management/:id/view',
    loadChildren: './job-management-mobile/job-management-view-mobile/job-management-view-mobile.module#JobManagementViewMobilePageModule',
    canLoad: [AdminGuard],
  },
  {
    path: 'admin/user-profile/:id',
    loadChildren: './user-profile-mobile/user-profile-mobile.module#UserProfileMobilePageModule',
    canLoad: [AdminGuard],
  },
  {
    path: 'admin/user-profile/:id/edit',
    loadChildren: './user-profile-edit-mobile/user-profile-edit-mobile.module#UserProfileEditMobilePageModule',
    canLoad: [AdminGuard],
  },
  {
    path: 'admin-reports',
    loadChildren: './admin-reports-mobile/admin-reports-mobile.module#AdminReportsMobilePageModule',
    canLoad: [AdminGuard],
  },
  {
    path: 'job-management/:id/edit',
    loadChildren: './job-management-mobile/job-management-edit-mobile/job-management-edit-mobile.module#JobManagementEditMobilePageModule',
    canLoad: [AdminGuard],
    resolve: {
      job: JobsManagementEditResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMobileRoutingModule {
}
