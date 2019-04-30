import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router, Route, CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/Observable';
import { catchError, first, map } from 'rxjs/operators';
import { RouterDirectionDirective } from '../../shared/router-direction.directive';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { ValidationService } from '../../utils/validation.service';
import { User, UserRole, UserStatus } from '../auth.model';
import { AuthService } from '../auth.service';

@Injectable({providedIn: 'root'})
export class GuardBaseGuard implements CanActivate, CanActivateChild, CanLoad {

  private navCtrl: NavController;

  constructor(
      private authService: AuthService,
      private localStorageService: LocalStorageService,
      private router: Router,
      private validationService: ValidationService,
      private injector: Injector
  ) {
    try {
      this.navCtrl = injector.get(NavController);
    } catch (e) {
    }
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess(state.url);
  }

  public canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess('/' + route.path);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess(state.url);
  }

  private canAccess(url: string): Observable<boolean> | Promise<boolean> | boolean {
    console.log('GuardBase', url);

    return this.authService.getUser().pipe(
        map((userData: User) => {
          switch (userData.role) {
            case UserRole.ADMIN:
              this.localStorageService.delete('country');
              this.redirectToPage(url, '/admin');
              break;
            case UserRole.USER:
              this.localStorageService.delete('country');

              if (userData.status === UserStatus.SOCIAL_SIGN_UP) {
                this.redirectToPage(url, '/register/social');
              } else if (userData.status === UserStatus.CHARGEBEE_SIGN_UP) {
                this.redirectToPage(url, '/register/chargebee');
              } else if (userData.status === UserStatus.FACEBOOK_NO_EMAIL) {
                this.redirectToPage(url, '/register/email');
              } else {
                this.redirectToPage(url, '/dashboard');
              }
              break;
            case UserRole.ANONYMOUS:

              const country = this.localStorageService.get('country');

              if ((country || '').length === 0) {
                this.redirectToPage(url, '/choose-your-country');

                if (this.navCtrl && this.navCtrl.setIntent) {
                  try {
                    this.navCtrl.setIntent(RouterDirectionDirective.textToIntent('root'));
                  } catch (e) {
                  }
                }

                return false;
              } else {
                this.redirectToPage(url, '/login');
              }

              break;
            default:
              this.redirectToPage(url, '/server-unavailable');
          }

          return true;
        }),
        first(),
        catchError((err) => {
          return of(this.checkOrRedirectToPage(url, '/server-unavailable'));
        })
    );
  }

  private checkOrRedirectToPage(currentUrl: string, nextUrl = ''): boolean {
    if (nextUrl.length > 0 && currentUrl !== nextUrl) {
      this.router.navigate([nextUrl]);

      if (this.navCtrl && this.navCtrl.setIntent) {
        try {
          this.navCtrl.setIntent(RouterDirectionDirective.textToIntent('root'));
        } catch (e) {
        }
      }

      return false;
    }
    return true;
  }

  private redirectToPage(currentUrl: string, nextUrl: string): void {
    if (this.validationService.isStringNotEmpty(nextUrl) && currentUrl !== nextUrl) {
      this.router.navigate([nextUrl]);
    }
  }
}
