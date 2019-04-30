import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../../web/src/app/shared/shared.module';
import { JobModule } from '../../../../../../web/src/app/user/job/job.module';

import { JobsMobilePage } from './jobs-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: JobsMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JobsMobilePage]
})
export class JobsMobilePageModule {}
