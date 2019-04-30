import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AuthModule } from '../../../../../web/src/app/auth/auth.module';

import { ServerUnavailableMobilePage } from './server-unavailable-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ServerUnavailableMobilePage
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
  declarations: [ServerUnavailableMobilePage]
})
export class ServerUnavailableMobilePageModule {}
