import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { GuardBaseGuard } from './authorization/guard-base.guard';

import { LogoutComponent } from './logout/logout.component';
import { ServerUnavailableComponent } from './server-unavailable/server-unavailable.component';

const authRoutes: Routes = [
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'server-unavailable',
    component: ServerUnavailableComponent,
    canActivate: [GuardBaseGuard],
    canLoad: [GuardBaseGuard],
  },
  {
    path: '',
    component: AccessDeniedComponent,
    canActivate: [GuardBaseGuard],
    canLoad: [GuardBaseGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
