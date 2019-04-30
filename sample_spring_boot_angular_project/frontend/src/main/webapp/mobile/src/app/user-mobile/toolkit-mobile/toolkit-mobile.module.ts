import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';
import { ToolkitModule } from '../../../../../web/src/app/user/toolkit/toolkit.module';

import { ToolkitMobilePage } from './toolkit-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ToolkitMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToolkitModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ToolkitMobilePage]
})
export class ToolkitMobilePageModule {}
