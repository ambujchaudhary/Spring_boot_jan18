import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardBaseGuard } from '../../../../web/src/app/auth/authorization/guard-base.guard';
import { LogoutComponent } from '../../../../web/src/app/auth/logout/logout.component';
import { AccessDeniedMobilePage } from './access-denied-mobile/access-denied-mobile.page';
import { ServerUnavailableMobilePage } from './server-unavailable-mobile/server-unavailable-mobile.page';

const routes: Routes = [
  {
    path: 'logout',
    component: LogoutComponent
    //    loadChildren: './logout-mobile/logout-mobile.module#LogoutMobilePageModule'
  },
  {
    path: 'access-denied',
    component: AccessDeniedMobilePage
    //    loadChildren: './access-denied-mobile/access-denied-mobile.module#AccessDeniedMobilePageModule',
  },
  {
    path: 'server-unavailable',
    component: ServerUnavailableMobilePage,
    //    loadChildren: './server-unavailable-mobile/server-unavailable-mobile.module#ServerUnavailableMobilePageModule',
    canActivate: [GuardBaseGuard],
    canLoad: [GuardBaseGuard],
  },
  {
    path: '',
    component: ServerUnavailableMobilePage,
    canActivate: [GuardBaseGuard],
    canLoad: [GuardBaseGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthMobileRoutingModule {
}
