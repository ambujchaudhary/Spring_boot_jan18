import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessProfileModule } from './business-profile/business-profile.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JobModule } from './job/job.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';
import { UserRoutingModule } from './user-routing.module';
import { SettingsModule } from './settings/settings.module';
import { MessagesModule } from './messages/messages.module';
import { ToolkitModule} from './toolkit/toolkit.module';

@NgModule({
  imports: [
    CommonModule,
    BusinessProfileModule,
    DashboardModule,
    JobModule,
    NotificationsModule,
    ProfileModule,
    UserRoutingModule,
    SettingsModule,
    MessagesModule,
    ToolkitModule,
  ],
  declarations: [],
})

export class UserModule {
}
