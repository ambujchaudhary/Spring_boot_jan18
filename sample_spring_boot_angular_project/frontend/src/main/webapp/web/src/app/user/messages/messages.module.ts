import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';

@NgModule({
  imports: [
    MessagesRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    MessagesComponent,
  ],
  exports: [
    MessagesComponent,
  ]
})
export class MessagesModule {
}
