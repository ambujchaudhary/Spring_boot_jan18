import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../../web/src/app/shared/shared.module';
import { ProfileModule } from '../../../../../../web/src/app/user/profile/profile.module';

import { ProfileViewMobilePage } from './profile-view-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileViewMobilePage
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
  declarations: [ProfileViewMobilePage]
})
export class ProfileViewMobilePageModule {}
