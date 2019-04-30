import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponents } from '../utils/zu-material-components.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LogoutComponent } from './logout/logout.component';
import { ServerUnavailableComponent } from './server-unavailable/server-unavailable.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    MaterialComponents
  ],
  declarations: [
    AccessDeniedComponent,
    LogoutComponent,
    ServerUnavailableComponent
  ],
  exports: [
    AccessDeniedComponent,
    LogoutComponent,
    ServerUnavailableComponent
  ]
})
export class AuthModule {
}
