import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BarRatingModule } from 'ngx-bar-rating';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../../shared/shared.module';
import { SharedUserModule } from '../shared-user/shared-user.module';
import { ConfirmOfferModalComponent } from './profile-view/confirm-offer-modal/confirm-offer-modal.component';
import { UserProfilePendingComponent } from './user-profile-pending/user-profile-pending.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SendOfferModalComponent } from './profile-view/send-offer-modal/send-offer-modal.component';
import { SendMessageModalComponent } from './profile-view/send-message-modal/send-message-modal.component';
import { OfferSentModalComponent } from './profile-view/offer-sent-modal/offer-sent-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MaterialComponents,
    ReactiveFormsModule,
    SharedUserModule,
    RouterModule,
    BarRatingModule
  ],
  declarations: [
    UserProfileComponent,
    UserProfilePendingComponent,
    ProfileViewComponent,
    SendOfferModalComponent,
    SendMessageModalComponent,
    ConfirmOfferModalComponent,
    OfferSentModalComponent
  ],
  exports: [
    UserProfileComponent,
    UserProfilePendingComponent,
    ProfileViewComponent
  ],
  entryComponents: [
    SendOfferModalComponent,
    SendMessageModalComponent,
    ConfirmOfferModalComponent,
    OfferSentModalComponent
  ]
})
export class ProfileModule {
}
