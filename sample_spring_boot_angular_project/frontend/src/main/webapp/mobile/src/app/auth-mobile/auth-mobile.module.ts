import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessDeniedMobilePageModule } from './access-denied-mobile/access-denied-mobile.module';
import { AuthMobileRoutingModule } from './auth-mobile-routing.module';
import { LogoutMobilePageModule } from './logout-mobile/logout-mobile.module';
import { ServerUnavailableMobilePageModule } from './server-unavailable-mobile/server-unavailable-mobile.module';

@NgModule({
  imports: [
    CommonModule,

    LogoutMobilePageModule,
    AccessDeniedMobilePageModule,
    ServerUnavailableMobilePageModule,

    AuthMobileRoutingModule
  ],
  declarations: []
})
export class AuthMobileModule { }
