import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';
import { DashboardModule } from '../../../../../web/src/app/user/dashboard/dashboard.module';

import { DashboardMobilePage } from './dashboard-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardMobilePage]
})
export class DashboardMobilePageModule {}
