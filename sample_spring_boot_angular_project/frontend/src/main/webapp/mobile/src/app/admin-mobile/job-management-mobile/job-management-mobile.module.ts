import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AdminModule } from '../../../../../web/src/app/admin/admin.module';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';

import { JobManagementMobilePage } from './job-management-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: JobManagementMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobManagementMobilePage]
})
export class JobManagementMobilePageModule {}
