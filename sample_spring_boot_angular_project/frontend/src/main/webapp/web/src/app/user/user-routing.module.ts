import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusinessProfileComponent } from './business-profile/business-profile.component';
import { ProfileViewResolverService } from './profile/profile-view/profile-view-resolver.service';
import { ProfileViewComponent } from './profile/profile-view/profile-view.component';
import { UserProfilePendingComponent } from './profile/user-profile-pending/user-profile-pending.component';
import { UserProfileComponent } from './profile/user-profile/user-profile.component';
import { ToolkitComponent } from './toolkit/toolkit.component';
import { UserGuard } from './user.guard';
import { SettingsComponent } from './settings/settings.component';

const userProfileRoutes: Routes = [
  {
    path: 'business-profile',
    component: BusinessProfileComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard]
  }, {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard]
  }, {
    path: 'profile/pending',
    component: UserProfilePendingComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard]
  }, {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
  }, {
    path: 'profile/:id',
    component: ProfileViewComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    resolve: {
      profile: ProfileViewResolverService
    }
  }, {
    path: 'toolkit',
    component: ToolkitComponent,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(userProfileRoutes)
  ],
  exports: [RouterModule],
  providers: [ProfileViewResolverService]
})
export class UserRoutingModule {
}
