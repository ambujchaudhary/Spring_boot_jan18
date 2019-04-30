import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../user.guard';
import { NotificationsResolverService } from './notifications-resolver.service';
import { NotificationsComponent } from './notifications.component';

const notificationsRoutes: Routes = [
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    resolve: {
      notifications: NotificationsResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(notificationsRoutes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {
}
