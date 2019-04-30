import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AnonymousModule } from '../../../../../web/src/app/anonymous/anonymous.module';

import { ForgotMobilePage } from './forgot-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnonymousModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ForgotMobilePage]
})
export class ForgotMobilePageModule {}
