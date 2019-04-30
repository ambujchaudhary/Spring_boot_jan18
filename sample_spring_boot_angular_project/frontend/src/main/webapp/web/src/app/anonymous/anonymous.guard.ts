import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, CanActivateChild, CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { catchError, first, map, take } from 'rxjs/operators';

import { User, UserRole, UserStatus } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { PermissibleRouteService } from '../auth/authorization/permissible-route.service';
import { RouterDirectionDirective } from '../shared/router-direction.directive';
import { ValidationService } from '../utils/validation.service';

@Injectable({providedIn: 'root'})
export class AnonymousGuard implements CanActivate, CanActivateChild, CanLoad {

  private navCtrl: NavController;

  constructor(
      private authService: AuthService,
      private permissibleRouteService: PermissibleRouteService,
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

  public canActivateChild(childRoute: ActivatedRouteSnapshot,
                          state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess(state.url);
  }

  public canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess('/' + route.path);
  }

  private canAccess(url: string): Observable<boolean> | Promise<boolean> | boolean {
    console.log('AnonymousGuard');

    return this.authService.getUser().pipe(
        map((userData: User) => {
          const isUserpermissible = this.permissibleRouteService.isUserHasPermission(url, userData.role);

          if (isUserpermissible === true) {
            switch (userData.status) {
              case UserStatus.CHARGEBEE_SIGN_UP:
                this.redirectToPage(url, '/register/chargebee');
                break;
              case UserStatus.FACEBOOK_NO_EMAIL:
                this.redirectToPage(url, '/register/email');
                break;
              case UserStatus.SOCIAL_SIGN_UP:
                this.redirectToPage(url, '/register/social');
                break;
              default: {
                if (userData.role !== UserRole.ANONYMOUS) {
                  this.redirectToPage(url, '/dashboard');
                }
              }
            }

            return true;
          } else {
            this.router.navigate(['/']);

            if (this.navCtrl && this.navCtrl.setIntent) {
              try {
                this.navCtrl.setIntent(RouterDirectionDirective.textToIntent('root'));
              } catch (e) {
              }
            }

            return false;
          }
        }),
        first(),
        catchError((err) => {
          this.router.navigate(['/']);

          if (this.navCtrl && this.navCtrl.setIntent) {
            try {
              this.navCtrl.setIntent(RouterDirectionDirective.textToIntent('root'));
            } catch (e) {
            }
          }

          return of(false);
        })
    );
  }

  private redirectToPage(currentUrl: string, nextUrl: string): void {
    if (this.validationService.isStringNotEmpty(nextUrl) && currentUrl !== nextUrl) {
      this.router.navigate([nextUrl]);

      if (this.navCtrl && this.navCtrl.setIntent) {
        try {
          this.navCtrl.setIntent(RouterDirectionDirective.textToIntent('root'));
        } catch (e) {
        }
      }
    }
  }

}
