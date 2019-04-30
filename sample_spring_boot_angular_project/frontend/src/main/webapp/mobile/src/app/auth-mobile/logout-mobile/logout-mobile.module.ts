import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AuthModule } from '../../../../../web/src/app/auth/auth.module';

import { LogoutMobilePage } from './logout-mobile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthModule
  ],
  declarations: [LogoutMobilePage]
})
export class LogoutMobilePageModule {}
