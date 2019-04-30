import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordMobilePageModule } from './change-password-mobile/change-password-mobile.module';
import { ChooseCountryMobilePageModule } from './choose-country-mobile/choose-country-mobile.module';
import { ForgotMobilePageModule } from './forgot-mobile/forgot-mobile.module';
import { LoginMobilePageModule } from './login-mobile/login-mobile.module';
import { RegisterMobilePageModule } from './register-mobile/register-mobile.module';

@NgModule({
  imports: [
    CommonModule,

    LoginMobilePageModule,
    ForgotMobilePageModule,
    RegisterMobilePageModule,
    ChangePasswordMobilePageModule,
    ChooseCountryMobilePageModule
  ],
  declarations: []
})
export class AnonymousMobileModule {
}
