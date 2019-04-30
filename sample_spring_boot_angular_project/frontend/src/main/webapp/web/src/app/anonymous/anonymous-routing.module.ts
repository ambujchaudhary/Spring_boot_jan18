import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousGuard } from './anonymous.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChooseCountryGuard } from './choose-country/choose-country.guard';
import { ChooseCountryComponent } from './choose-country/choose-country.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard]
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard]
  },
  {
    path: 'register/:type',
    component: RegisterComponent,
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard]
  },
  {
    path: 'change-password/:token',
    component: ChangePasswordComponent,
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard]
  },
  {
    path: 'change-password',
    redirectTo: '/choose-your-country',
    pathMatch: 'full',
  },
  {
    path: 'choose-your-country',
    component: ChooseCountryComponent,
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AnonymousRoutingModule { }
