import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AuthModule } from '../../../../../web/src/app/auth/auth.module';

import { AccessDeniedMobilePage } from './access-denied-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: AccessDeniedMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccessDeniedMobilePage]
})
export class AccessDeniedMobilePageModule {}
