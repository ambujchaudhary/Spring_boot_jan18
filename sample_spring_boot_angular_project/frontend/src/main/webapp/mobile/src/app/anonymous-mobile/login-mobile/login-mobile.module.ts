import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AnonymousModule } from '../../../../../web/src/app/anonymous/anonymous.module';
import { SharedModule } from '../../../../../web/src/app/shared/shared.module';
import { MaterialComponents } from '../../../../../web/src/app/utils/zu-material-components.module';

import { LoginMobilePage } from './login-mobile.page';

const routes: Routes = [
  {
    path: '',
    component: LoginMobilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MaterialComponents,
    ReactiveFormsModule,

    AnonymousModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginMobilePage]
})
export class LoginMobilePageModule {
}
