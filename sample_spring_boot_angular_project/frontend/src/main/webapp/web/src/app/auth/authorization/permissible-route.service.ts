import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserRole } from '../auth.model';
import { PERMISSIBLE_ROUTES } from './permissible-routes';

@Injectable({providedIn: 'root'})
export class PermissibleRouteService {

  static isAuthenticatedUser(userRole: UserRole): boolean {
    return userRole !== UserRole.ANONYMOUS;
  }

  static isAdmin(userRole: UserRole): boolean {
    return userRole === UserRole.ADMIN;
  }

  constructor(private router: Router) {
  }

  private matchUrl(url: string): Array<UserRole> {
    const permissibleRoutes = PERMISSIBLE_ROUTES.find((aPermissibleRoute) => aPermissibleRoute.path.test(url));

    if (typeof permissibleRoutes === 'object' && permissibleRoutes.userRoles) {
      return permissibleRoutes.userRoles;
    } else {
      return [] as UserRole[];
    }
  }

  private getProtectedUser(permissibleRoles: UserRole[]): Array<UserRole> {
    let permissibleUserRoles: UserRole[];
    permissibleUserRoles = permissibleRoles.filter(
        (permissibleRole) => PermissibleRouteService.isAuthenticatedUser(permissibleRole) === true);

    return permissibleUserRoles;
  }

  private getPublicUser(permissibleRoles: UserRole[]): Array<UserRole> {
    let permissibleUserRoles: UserRole[];
    permissibleUserRoles = permissibleRoles.filter(
        (permissibleRole) => PermissibleRouteService.isAuthenticatedUser(permissibleRole) === false);

    return permissibleUserRoles;
  }

  isAuthorized(url: string): boolean {
    let authorized = false;

    const permissibleRoles = this.matchUrl(url);

    const protectedPermissibleRoles = this.getProtectedUser(permissibleRoles);
    let publicPermissibleRoles: UserRole[];

    if (protectedPermissibleRoles.length === 0) {
      publicPermissibleRoles = this.getPublicUser(permissibleRoles);
    }

    if (protectedPermissibleRoles.length > 0) {
      authorized = true;
    } else if (publicPermissibleRoles.length > 0) {
      authorized = false;
    } else {

      if (authorized === false) {
        this.router.navigate(['/login']);
      }
    }

    return authorized;
  }

  isUserHasPermission(url: string, userRole: UserRole): boolean {
    let isPermission = false;

    const permissibleRoles = this.matchUrl(url);

    if (permissibleRoles.length > 0) {
      isPermission = permissibleRoles.some((permissibleRole) => permissibleRole === userRole);
    } else {
      isPermission = false;
    }

    return isPermission;
  }
}
