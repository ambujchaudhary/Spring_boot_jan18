import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';
import { NotificationsModule } from '../../../../../web/src/app/user/notifications/notifications.module';

import { NotificationsMobilePage } from './notifications-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificationsMobilePage]
})
export class NotificationsMobilePageModule {}
