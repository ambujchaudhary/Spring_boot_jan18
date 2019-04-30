import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnonymousGuard } from '../../../../web/src/app/anonymous/anonymous.guard';
import { ChooseCountryGuard } from '../../../../web/src/app/anonymous/choose-country/choose-country.guard';
import { ChangePasswordMobilePage } from './change-password-mobile/change-password-mobile.page';
import { ChooseCountryMobilePage } from './choose-country-mobile/choose-country-mobile.page';
import { ForgotMobilePage } from './forgot-mobile/forgot-mobile.page';
import { LoginMobilePage } from './login-mobile/login-mobile.page';
import { RegisterMobilePage } from './register-mobile/register-mobile.page';

const routes: Routes = [
  {
    path: 'login',
    component: LoginMobilePage,
    //    loadChildren: './login-mobile/login-mobile.module#LoginMobilePageModule',
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard, ChooseCountryGuard],
  },
  {
    path: 'forgot',
    component: ForgotMobilePage,
    //    loadChildren: './forgot-mobile/forgot-mobile.module#ForgotMobilePageModule',
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard, ChooseCountryGuard],
  },
  {
    path: 'register/:type',
    component: RegisterMobilePage,
    //    loadChildren: './register-mobile/register-mobile.module#RegisterMobilePageModule',
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard],
  },
  {
    path: 'register',
    component: RegisterMobilePage,
    //    loadChildren: './register-mobile/register-mobile.module#RegisterMobilePageModule',
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard, ChooseCountryGuard],
  },
  {
    path: 'change-password/:token',
    component: ChangePasswordMobilePage,
    //    loadChildren: './change-password-mobile/change-password-mobile.module#ChangePasswordMobilePageModule',
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard],
  },
  {
    path: 'change-password',
    redirectTo: '/choose-your-country',
    pathMatch: 'full',
  },
  {
    path: 'choose-your-country',
    component: ChooseCountryMobilePage,
    //    loadChildren: './choose-country-mobile/choose-country-mobile.module#ChooseCountryMobilePageModule',
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousMobileRoutingModule {
}
