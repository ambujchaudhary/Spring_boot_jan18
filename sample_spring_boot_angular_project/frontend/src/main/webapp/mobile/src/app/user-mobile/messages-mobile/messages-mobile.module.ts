import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';
import { MessagesModule } from '../../../../../web/src/app/user/messages/messages.module';

import { MessagesMobilePage } from './messages-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: MessagesMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MessagesMobilePage]
})
export class MessagesMobilePageModule {}
