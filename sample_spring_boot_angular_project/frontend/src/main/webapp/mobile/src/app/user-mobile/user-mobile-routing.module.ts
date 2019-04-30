import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobViewResolverService } from '../../../../web/src/app/user/job/job-view/job-view-resolver.service';
import { PostJobResolverService } from '../../../../web/src/app/shared/post-job/post-job-resolver.service';
import { NotificationsResolverService } from '../../../../web/src/app/user/notifications/notifications-resolver.service';
import { ProfileViewResolverService } from '../../../../web/src/app/user/profile/profile-view/profile-view-resolver.service';
import { UserGuard } from '../../../../web/src/app/user/user.guard';
import { BusinessProfileMobilePage } from './business-profile-mobile/business-profile-mobile.page';
import { DashboardMobilePage } from './dashboard-mobile/dashboard-mobile.page';
import { FindJobMobilePage } from './job-mobile/find-job-mobile/find-job-mobile.page';
import { JobViewMobilePage } from './job-mobile/job-view-mobile/job-view-mobile.page';
import { JobsMobilePage } from './job-mobile/jobs-mobile/jobs-mobile.page';
import { PostJobMobilePage } from './job-mobile/post-job-mobile/post-job-mobile.page';
import { MessagesMobilePage } from './messages-mobile/messages-mobile.page';
import { NotificationsMobilePage } from './notifications-mobile/notifications-mobile.page';
import { ProfileViewMobilePage } from './profile-mobile/profile-view-mobile/profile-view-mobile.page';
import { UserProfileMobilePage } from './profile-mobile/user-profile-mobile/user-profile-mobile.page';
import { UserProfilePendingMobilePage } from './profile-mobile/user-profile-pending-mobile/user-profile-pending-mobile.page';
import { SettingsMobilePage } from './settings-mobile/settings-mobile.page';
import { ToolkitMobilePage } from './toolkit-mobile/toolkit-mobile.page';

const routes: Routes = [
  {
    path: 'business-profile',
    // loadChildren: './business-profile-mobile/business-profile-mobile.module#BusinessProfileMobilePageModule',
    component: BusinessProfileMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'dashboard',
    // loadChildren: './dashboard-mobile/dashboard-mobile.module#DashboardMobilePageModule',
    component: DashboardMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'profile',
    // loadChildren: './profile-mobile/user-profile-mobile/user-profile-mobile.module#UserProfileMobilePageModule',
    component: UserProfileMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'profile/pending',
    // loadChildren: './profile-mobile/user-profile-pending-mobile/user-profile-pending-mobile.module#UserProfilePendingMobilePageModule',
    component: UserProfilePendingMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'profile/:id',
    // loadChildren: './profile-mobile/profile-view-mobile/profile-view-mobile.module#ProfileViewMobilePageModule',
    component: ProfileViewMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    },
    resolve: {
      profile: ProfileViewResolverService
    }
  },
  {
    path: 'settings',
    // loadChildren: './settings-mobile/settings-mobile.module#SettingsMobilePageModule',
    component: SettingsMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'notifications',
    // loadChildren: './notifications-mobile/notifications-mobile.module#NotificationsMobilePageModule',
    component: NotificationsMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    },
    resolve: {
      notifications: NotificationsResolverService
    }
  },
  {
    path: 'messages',
    // loadChildren: './messages-mobile/messages-mobile.module#MessagesMobilePageModule',
    component: MessagesMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'job',
    // loadChildren: './job-mobile/post-job-mobile/post-job-mobile.module#PostJobMobilePageModule',
    component: PostJobMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'job/:id',
    // loadChildren: './job-mobile/post-job-mobile/post-job-mobile.module#PostJobMobilePageModule',
    component: PostJobMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    },
    resolve: {
      job: PostJobResolverService
    }
  },
  {
    path: 'job/:id/view',
    // loadChildren: './job-mobile/job-view-mobile/job-view-mobile.module#JobViewMobilePageModule',
    component: JobViewMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    },
    resolve: {
      jobViewData: JobViewResolverService
    }
  },
  {
    path: 'jobs',
    // loadChildren: './job-mobile/jobs-mobile/jobs-mobile.module#JobsMobilePageModule',
    component: JobsMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'find-job',
    // loadChildren: './job-mobile/find-job-mobile/find-job-mobile.module#FindJobMobilePageModule',
    component: FindJobMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  },
  {
    path: 'toolkit',
    // loadChildren: './toolkit-mobile/toolkit-mobile.module#ToolkitMobilePageModule',
    component: ToolkitMobilePage,
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    data: {
      hideHeaderOnMobile: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMobileRoutingModule {
}
