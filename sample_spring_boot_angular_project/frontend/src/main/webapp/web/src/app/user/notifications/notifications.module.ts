import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  imports: [
    NotificationsRoutingModule,
    CommonModule,
    FormsModule,
    MaterialComponents,
    SharedModule
  ],
  declarations: [
      NotificationsComponent
  ],
  exports: [
      NotificationsComponent
  ]
})
export class NotificationsModule {
}
