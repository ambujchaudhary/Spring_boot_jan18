import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AdminModule } from '../../../../../../web/src/app/admin/admin.module';
import { SharedModule } from '../../../../../../web/src/app/shared/shared.module';

import { JobManagementEditMobilePage } from './job-management-edit-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: JobManagementEditMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    AdminModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobManagementEditMobilePage]
})
export class JobManagementEditMobilePageModule {}
