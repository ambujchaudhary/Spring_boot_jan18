import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialComponents } from '../utils/zu-material-components.module';
import { SharedModule } from '../shared/shared.module';
import { AnonymousRoutingModule } from './anonymous-routing.module';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChooseCountryComponent } from './choose-country/choose-country.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChargebeeConnectionComponent } from './register/chargebee-connection/chargebee-connection.component';
import { AccountBlockedModalComponent } from './login/account-blocked-modal/account-blocked-modal.component';
import { TermsAndConditionsComponent } from './register/terms-and-conditions/terms-and-conditions.component';
import { FacebookSignInComponent } from './socials/facebook-sign-in/facebook-sign-in.component';
import { GoogleSignInComponent } from './socials/google-sign-in/google-sign-in.component';

@NgModule({
  imports: [
    AnonymousRoutingModule,
    CommonModule,
    FormsModule,
    MaterialComponents,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ForgotComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ChooseCountryComponent,
    ChargebeeConnectionComponent,
    AccountBlockedModalComponent,
    TermsAndConditionsComponent,
    GoogleSignInComponent,
    FacebookSignInComponent
  ],
  exports: [
    ForgotComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ChooseCountryComponent,
    ChargebeeConnectionComponent,
    AccountBlockedModalComponent,
    GoogleSignInComponent,
    FacebookSignInComponent
  ],
  entryComponents: [AccountBlockedModalComponent]
})
export class AnonymousModule {
}
