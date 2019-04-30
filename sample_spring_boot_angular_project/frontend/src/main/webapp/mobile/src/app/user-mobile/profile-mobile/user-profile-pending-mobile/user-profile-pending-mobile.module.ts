import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../../web/src/app/shared/shared.module';
import { ProfileModule } from '../../../../../../web/src/app/user/profile/profile.module';

import { UserProfilePendingMobilePage } from './user-profile-pending-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePendingMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserProfilePendingMobilePage]
})
export class UserProfilePendingMobilePageModule {}
