import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardMobilePageModule } from './admin-dashboard-mobile/admin-dashboard-mobile.module';
import { JobManagementMobilePageModule } from './job-management-mobile/job-management-mobile.module';
import { JobManagementViewMobilePageModule } from './job-management-mobile/job-management-view-mobile/job-management-view-mobile.module';
import { UserProfileEditMobilePageModule } from './user-profile-edit-mobile/user-profile-edit-mobile.module';
import { UserProfileMobilePageModule } from './user-profile-mobile/user-profile-mobile.module';
import { AdminReportsMobilePageModule } from './admin-reports-mobile/admin-reports-mobile.module';

@NgModule({
  imports: [
    CommonModule,

    AdminDashboardMobilePageModule,
    JobManagementMobilePageModule,
    UserProfileMobilePageModule,
    UserProfileEditMobilePageModule,
    AdminReportsMobilePageModule,
    JobManagementViewMobilePageModule
  ],
  declarations: []
})
export class AdminMobileModule { }
