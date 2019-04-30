import { Injectable, Injector, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, Route, CanLoad } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { catchError, first, map } from 'rxjs/operators';
import { PushNotificationsService } from '../../../../mobile/src/app/push-notifications.service';
import { User, UserRole, UserStatus } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { PermissibleRouteService } from '../auth/authorization/permissible-route.service';
import { LocalStorageService } from '../utils/storage/local-storage.service';
import { SessionStorageService } from '../utils/storage/session-storage.service';
import { WebSocketService } from '../utils/web-sockte/web-sockte.service';
import { PreExpireJobData } from './job/job.model';
import { JobService } from './job/job.service';
import { JobDataForFeedback, userRoutingPaths } from './user.model';
import { ValidationService } from '../utils/validation.service';
import { UserService } from './user.service';

@Injectable({providedIn: 'root'})
export class UserGuard implements CanActivate, CanLoad {

  private initSocketTimer: any;

  private platform: Platform;
  private toastCtrl: ToastController;
  private push: PushNotificationsService;

  constructor(
      private authService: AuthService,
      private permissibleRouteService: PermissibleRouteService,
      private validationService: ValidationService,
      private localStorageService: LocalStorageService,
      private sessionStorageService: SessionStorageService,
      private webSocketService: WebSocketService,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private jobService: JobService,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
      this.toastCtrl = injector.get(ToastController);
      this.push = injector.get(PushNotificationsService);
    } catch (e) {
    }
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.canAccess(state.url);
  }

  public canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess('/' + route.path);
  }

  private canAccess(url: string): Observable<boolean> | Promise<boolean> | boolean {
    console.log('UserGuard');

    return this.authService.getUser().pipe(
        map((user: User) => {
          this.notificationSetup(user.id);

          this.sessionStorageService.setObject<User>('user', user);

          const isUserpermissible = this.permissibleRouteService.isUserHasPermission(url, user.role);

          if (isUserpermissible === true) {
            this.localStorageService.delete('country');

            // Connecting to Intercom
            this.connectToIntercom(user);

            const redirectUrl = this.getUrlForRedirect(user.status);

            this.redirectToPage(url, redirectUrl);

            if (user.status === UserStatus.CHARGEBEE_SIGN_UP) {
              this.redirectToPage(url, '/register/chargebee');
            }

            if (user.status === UserStatus.SOCIAL_SIGN_UP) {
              this.redirectToPage(url, '/register/social');
            }

            if (user.status === UserStatus.FACEBOOK_NO_EMAIL) {
              this.redirectToPage(url, '/register/email');
            }

            if (user.status !== UserStatus.SOCIAL_SIGN_UP && user.status !== UserStatus.NO_BUSINESS && user.status !==
                UserStatus.CHARGEBEE_SIGN_UP) {
              this.initWebSocket();
              this.checkLocalStorage();
              this.checkForModal(url);
            }

            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }

        }),
        first(),
        catchError((err) => {
          const user = this.sessionStorageService.getObject<User>('user');

          if (user && user.role === UserRole.ANONYMOUS) {
            this.router.navigate(['/']);
            return of(false);
          }

          return of(false);
        })
    );
  }

  private initWebSocket() {

    const authToken = this.localStorageService.get('authToken');

    if (!authToken) {
      this.initSocketTimer = setTimeout(
          () => {
            this.initWebSocket();
          },
          100);
    }

    clearTimeout(this.initSocketTimer);

    try {
      this.webSocketService.initSocket(authToken);
    } catch (e) {
      console.error(`Can't init WebSocket`, e);

      this.initSocketTimer = setTimeout(
          () => {
            this.initWebSocket();
          },
          1000);
    }
  }

  private getUrlForRedirect(status: UserStatus): string {
    let redirectUrl: string;
    switch (status) {
      case UserStatus.NO_BUSINESS:
        redirectUrl = userRoutingPaths.businessProfile;
        break;
      case UserStatus.PENDING:
        redirectUrl = userRoutingPaths.userProfilePending;
        break;
      case UserStatus.NEW:
      case UserStatus.VERIFICATION_FAILED:
        redirectUrl = userRoutingPaths.userProfile;
        break;
      default:
        redirectUrl = '';
    }

    if (this.validationService.isStringNotEmpty(redirectUrl) === true) {
      redirectUrl = `/${redirectUrl}`;
    }

    return redirectUrl;
  }

  private redirectToPage(currentUrl: string, nextUrl: string): void {
    if (this.validationService.isStringNotEmpty(nextUrl) && currentUrl !== nextUrl) {
      this.router.navigate([nextUrl]);
    }
  }

  private connectToIntercom(data: User): void {
    (<any>window).Intercom('boot', {
      app_id: 'ewu3cku7',
      email: data.email,
      name: data.firstName,
      user_id: data.id
    });
  }

  private checkForModal(url: string): void {
    const feedbackModalData = this.localStorageService.getObject<JobDataForFeedback[]>('feedbackModalData');
    const autocompleteModalData = this.localStorageService.getObject<JobDataForFeedback[]>('autocompleteModalData');

    if (Array.isArray(feedbackModalData) && feedbackModalData.length > 0 && feedbackModalData !== null) {
      this.redirectToPage(url, '/dashboard');
    }

    if (Array.isArray(autocompleteModalData) && autocompleteModalData.length > 0 && autocompleteModalData !== null) {
      this.redirectToPage(url, '/dashboard');
    }
  }

  private checkLocalStorage(): void {
    if (this.localStorageService.getObject<JobDataForFeedback[]>('feedbackModalData') !== null) {
      this.userService.getJobsForShooterFeedback().subscribe(
          () => {}
      );
    } else if (this.localStorageService.getObject<JobDataForFeedback[]>('autocompleteModalData') !== null) {
      this.userService.getAutocompleteJobs().subscribe(
          () => {}
      );
    } else if (this.localStorageService.getObject<PreExpireJobData[]>('preExpireJobModalData') !== null) {
      this.jobService.getPreExpireJobs().subscribe(
          () => {}
      );
    }
  }

  // Push notifications methods below
  private async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup(id) {
    try {
      if (this.platform.is('mobile')) {

        if (this.sessionStorageService.getObject<User>('user') === null) {
          this.push.getToken(id);
        }

        this.push.onNotifications().subscribe(
            (msg) => {
              if (msg.tap === true) {
                console.log(msg);
                if (msg.userId !== '' && msg.jobId !== '') {
                  this.router.navigate([msg.link], {queryParams: {jobId: msg.jobId, userId: msg.userId}});
                } else {
                  this.router.navigate([msg.link]);
                }
              }

              if (this.platform.is('ios')) {
                this.presentToast(msg.aps.alert);
              } else {
                this.presentToast(msg.body);
              }
            });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
