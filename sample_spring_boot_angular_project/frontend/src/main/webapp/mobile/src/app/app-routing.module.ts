import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnonymousGuard } from '../../../web/src/app/anonymous/anonymous.guard';
import { ChooseCountryGuard } from '../../../web/src/app/anonymous/choose-country/choose-country.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './anonymous-mobile/login-mobile/login-mobile.module#LoginMobilePageModule',
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard, ChooseCountryGuard],
  },
  {
    path: 'forgot',
    loadChildren: './anonymous-mobile/forgot-mobile/forgot-mobile.module#ForgotMobilePageModule',
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard, ChooseCountryGuard],
  },
  {
    path: 'register/:type',
    loadChildren: './anonymous-mobile/register-mobile/register-mobile.module#RegisterMobilePageModule',
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard],
  },
  {
    path: 'register',
    loadChildren: './anonymous-mobile/register-mobile/register-mobile.module#RegisterMobilePageModule',
    canActivate: [AnonymousGuard, ChooseCountryGuard],
    canLoad: [AnonymousGuard, ChooseCountryGuard],
  },
  {
    path: 'change-password/:token',
    loadChildren: './anonymous-mobile/change-password-mobile/change-password-mobile.module#ChangePasswordMobilePageModule',
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
    loadChildren: './anonymous-mobile/choose-country-mobile/choose-country-mobile.module#ChooseCountryMobilePageModule',
    canActivate: [AnonymousGuard],
    canLoad: [AnonymousGuard],
  },
];

const routesRoot: Routes = [
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routesRoot)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
