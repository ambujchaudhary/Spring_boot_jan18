import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../user.guard';
import { MessagesComponent } from './messages.component';

const messageRoutes: Routes = [
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(messageRoutes)],
  exports: [RouterModule],
})
export class MessagesRoutingModule {
}
