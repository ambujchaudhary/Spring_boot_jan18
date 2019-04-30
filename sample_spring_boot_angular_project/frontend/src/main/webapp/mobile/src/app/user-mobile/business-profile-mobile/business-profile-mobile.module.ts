import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';
import { BusinessProfileModule } from '../../../../../web/src/app/user/business-profile/business-profile.module';

import { BusinessProfileMobilePage } from './business-profile-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessProfileMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,

    FormsModule,
    IonicModule,
    BusinessProfileModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BusinessProfileMobilePage]
})
export class BusinessProfileMobilePageModule {}
