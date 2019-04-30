import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AnonymousModule } from '../../../../../web/src/app/anonymous/anonymous.module';

import { ChooseCountryMobilePage } from './choose-country-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseCountryMobilePage,
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
  declarations: [ChooseCountryMobilePage]
})
export class ChooseCountryMobilePageModule {}
