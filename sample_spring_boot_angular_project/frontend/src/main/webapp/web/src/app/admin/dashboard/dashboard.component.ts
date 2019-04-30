import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../../auth/auth.model';
import { AdminService } from '../admin.service';
import { AdminUserManagementInfo, UserTableTabsEnum } from '../admin.model';

@Component({
  selector: 'zu-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public users: AdminUserManagementInfo;
  public readonly userTableTabsEnum = UserTableTabsEnum;

  public searchUser = '';

  constructor(
      private adminService: AdminService
  ) {}

  public getStatusLabel(status: UserStatus): string {
    switch (status) {
      case UserStatus.CHARGEBEE_SIGN_UP:
        return 'NO CHARGEBEE DATA';
      case UserStatus.NO_BUSINESS:
        return 'NO BUSINESS DATA';
      case UserStatus.NEW:
        return 'NO PROFILE DATA';
      case UserStatus.FACEBOOK_NO_EMAIL:
        return 'FACEBOOK WITHOUT EMAIL';
      case UserStatus.SOCIAL_SIGN_UP:
        return 'SOCIAL REGISTRATION';
      default:
        return UserStatus[status] || '';
    }
  }

  ngOnInit() {
    this.getUserList();
  }

  private getUserList(): void {

    this.adminService.getUsers().subscribe((data: AdminUserManagementInfo) => {
      if (data && Array.isArray(data.new)) {
        data.new.forEach((newUser) => newUser.statusLabel = this.getStatusLabel(newUser.status));
      }

      this.users = data;
    });
  }

  public getUserUrl(id: number): string {
    return `/admin/user-profile/${id}`;
  }

  public getCounter(type: UserTableTabsEnum): string {
    if (typeof this.users !== 'undefined') {
      switch (type) {
        case this.userTableTabsEnum.APPROVED:
          return `APPROVED(${this.users.approvedCounter})`;
        case this.userTableTabsEnum.PENDING:
          return `PENDING(${this.users.pendingCounter})`;
        case this.userTableTabsEnum.NEW:
          return `NEW(${this.users.newCounter})`;
        case this.userTableTabsEnum.BLOCKED:
          return `DECLINED/BLOCKED(${this.users.blockedCounter})`;
        default:
          return `APPROVED(${this.users.approvedCounter})`;
      }
    }
  }
}
