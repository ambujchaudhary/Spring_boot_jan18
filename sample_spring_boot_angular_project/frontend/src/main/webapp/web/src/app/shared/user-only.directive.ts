import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { User, UserRole } from '../auth/auth.model';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[zuUserOnly]'
})
export class UserOnlyDirective {

  readonly USER_ROLES = [UserRole.USER];

  constructor(
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef,
      private authService: AuthService) {
  }

  @Input() set zuUserOnly(userRoles: Array<UserRole>) {
    this.authService.getUser().subscribe((user: User) => {
      if (typeof user === 'object' && user.role) {
        this.display(user, this.USER_ROLES);
      }
    });
  }

  display(user: User, userRoles: UserRole[] = []) {
    const isUserAdmin = userRoles.some((aUserRole) => aUserRole === user.role);

    if (isUserAdmin === true) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
