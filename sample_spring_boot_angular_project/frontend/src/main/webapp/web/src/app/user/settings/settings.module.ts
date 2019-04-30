import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedUserModule } from '../shared-user/shared-user.module';
import { SettingsComponent } from './settings.component';
import { CancelMembershipModalComponent } from './cancel-membership-modal/cancel-membership-modal.component';
import { ManagePaymentDetailsComponent } from './manage-payment-details/manage-payment-details.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { MembershipDetailsComponent } from './membership-details/membership-details.component';
import { MembershipDetailsModalComponent } from './membership-details/membership-details-modal/membership-details-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialComponents,
    ReactiveFormsModule,
    SharedUserModule,
    RouterModule
  ],
  declarations: [
    SettingsComponent,
    CancelMembershipModalComponent,
    ManagePaymentDetailsComponent,
    ChangePasswordModalComponent,
    MembershipDetailsComponent,
    MembershipDetailsModalComponent,
  ],
  exports: [
    SettingsComponent
  ],
  entryComponents: [
    CancelMembershipModalComponent,
    ChangePasswordModalComponent,
    MembershipDetailsModalComponent
  ],
})
export class SettingsModule {
}
