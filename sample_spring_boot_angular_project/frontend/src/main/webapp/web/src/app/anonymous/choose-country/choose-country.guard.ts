import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { PermissibleRouteService } from '../../auth/authorization/permissible-route.service';
import { RouterDirectionDirective } from '../../shared/router-direction.directive';
import { LocalStorageService } from '../../utils/storage/local-storage.service';

@Injectable({providedIn: 'root'})
export class ChooseCountryGuard implements CanActivate, CanLoad {

  private navCtrl: NavController;

  constructor(
      private authService: AuthService,
      private permissibleRouteService: PermissibleRouteService,
      private localStorageService: LocalStorageService,
      private router: Router,
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

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess(state.url);
  }

  canAccess(url: string): Observable<boolean> | Promise<boolean> | boolean {
    console.log('ChooseCountryGuard');

    const country = this.localStorageService.get('country');

    if ((country || '').length === 0) {
      this.router.navigate(['/choose-your-country']);

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

}
