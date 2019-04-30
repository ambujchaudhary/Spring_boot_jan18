import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProfileMobilePageModule } from './business-profile-mobile/business-profile-mobile.module';
import { DashboardMobilePageModule } from './dashboard-mobile/dashboard-mobile.module';
import { FindJobMobilePageModule } from './job-mobile/find-job-mobile/find-job-mobile.module';
import { JobViewMobilePageModule } from './job-mobile/job-view-mobile/job-view-mobile.module';
import { JobsMobilePageModule } from './job-mobile/jobs-mobile/jobs-mobile.module';
import { PostJobMobilePageModule } from './job-mobile/post-job-mobile/post-job-mobile.module';
import { MessagesMobilePageModule } from './messages-mobile/messages-mobile.module';
import { NotificationsMobilePageModule } from './notifications-mobile/notifications-mobile.module';
import { ProfileViewMobilePageModule } from './profile-mobile/profile-view-mobile/profile-view-mobile.module';
import { UserProfileMobilePageModule } from './profile-mobile/user-profile-mobile/user-profile-mobile.module';
import { UserProfilePendingMobilePageModule } from './profile-mobile/user-profile-pending-mobile/user-profile-pending-mobile.module';
import { SettingsMobilePageModule } from './settings-mobile/settings-mobile.module';
import { ToolkitMobilePageModule } from './toolkit-mobile/toolkit-mobile.module';
import { UserMobileRoutingModule } from './user-mobile-routing.module';

@NgModule({
  imports: [
    CommonModule,

    BusinessProfileMobilePageModule,
    DashboardMobilePageModule,
    UserProfileMobilePageModule,
    UserProfilePendingMobilePageModule,
    ProfileViewMobilePageModule,
    SettingsMobilePageModule,
    NotificationsMobilePageModule,
    MessagesMobilePageModule,
    PostJobMobilePageModule,
    JobViewMobilePageModule,
    JobsMobilePageModule,
    FindJobMobilePageModule,
    ToolkitMobilePageModule,

    UserMobileRoutingModule
  ],
  declarations: []
})
export class UserMobileModule {
}
