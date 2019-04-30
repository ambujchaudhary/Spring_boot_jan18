import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponents } from '../utils/zu-material-components.module';
import { SharedModule } from '../shared/shared.module';
import { SharedUserModule } from '../user/shared-user/shared-user.module';
import { TextMaskModule } from 'angular2-text-mask';

// others
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsManagementComponent } from './jobs-management/jobs-management.component';
import { ProfileViewHeaderButtonsComponent } from './user-profile/profile-view-header-buttons/profile-view-header-buttons.component';
import { BlockUserModalComponent } from './user-profile/profile-view-header-buttons/block-user-modal/block-user-modal.component';
import { UnblockUserModalComponent } from './user-profile/profile-view-header-buttons/unblock-user-modal/unblock-user-modal.component';
import { UserProfileEditComponent } from './user-profile/user-profile-edit/user-profile-edit.component';
import { FilterPipe } from './dashboard/filter.pipe';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { DatepickerComponent } from './admin-shared/datepicker/datepicker.component';
import { NewUserPipe } from './dashboard/new-user.pipe';
import { JobsTitlePipe } from './jobs-management/jobs-title.pipe';
import { JobsManagementViewComponent } from './jobs-management/jobs-management-view/jobs-management-view.component';
import { JobsManagementEditComponent } from './jobs-management/jobs-management-edit/jobs-management-edit.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    MaterialComponents,
    ReactiveFormsModule,
    SharedModule,
    SharedUserModule,
    TextMaskModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    JobsManagementComponent,
    ProfileViewHeaderButtonsComponent,
    BlockUserModalComponent,
    UnblockUserModalComponent,
    UserProfileEditComponent,
    FilterPipe,
    NewUserPipe,
    AdminReportsComponent,
    DatepickerComponent,
    JobsTitlePipe,
    JobsManagementViewComponent,
    JobsManagementEditComponent
  ],
  exports: [
    DashboardComponent,
    UserProfileComponent,
    JobsManagementComponent,
    UserProfileEditComponent,
    AdminReportsComponent,
    DatepickerComponent,
    JobsManagementViewComponent,
    JobsManagementEditComponent
  ],
  entryComponents: [
    BlockUserModalComponent,
    UnblockUserModalComponent
  ]
})

export class AdminModule {
}
