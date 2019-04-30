import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, take } from 'rxjs/operators';
import { User } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { PermissibleRouteService } from '../auth/authorization/permissible-route.service';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
  constructor(
      private authService: AuthService,
      private permissibleRouteService: PermissibleRouteService,
      private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess(state.url);
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.canAccess('/' + route.path);
  }

  canAccess(url: string): Observable<boolean> | Promise<boolean> | boolean {
    console.log('AdminGuard');

    return this.authService.getUser().pipe(
        map((userData: User) => {
          const isUserpermissible = this.permissibleRouteService.isUserHasPermission(url, userData.role);

          if (isUserpermissible === true) {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }

        }),
        take(1),
        catchError((err) => {
          this.router.navigate(['/']);
          return of(false);
        })
    );
  }
}
