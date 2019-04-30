import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserRole } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[zuAdminOnly]'
})
export class AdminOnlyDirective {

  readonly ADMIN_ROLES = [UserRole.ADMIN];

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private authService: AuthService) {
  }

  @Input() set zuAdminOnly(userRoles: Array<UserRole>) {
    this.authService.getUser().subscribe((user: User) => {
      if (typeof user === 'object' && user.role) {
        this.display(user, this.ADMIN_ROLES);
      }
    });
  }

  display(user: User, userRoles: UserRole[] = []): boolean {
    const isUserAdmin = userRoles.some(aUserRole => aUserRole === user.role);

    if (isUserAdmin === true) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      return true;
    } else {
      this.viewContainer.clear();
      return false;
    }
  }

}
