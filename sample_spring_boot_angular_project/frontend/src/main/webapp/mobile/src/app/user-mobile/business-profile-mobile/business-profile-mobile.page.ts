import { Component, OnInit } from '@angular/core';
import { User, UserStatus } from '../../../../../web/src/app/auth/auth.model';
import { SessionStorageService } from '../../../../../web/src/app/utils/storage/session-storage.service';

@Component({
  selector: 'zum-business-profile-mobile',
  templateUrl: './business-profile-mobile.page.html',
  styleUrls: ['./business-profile-mobile.page.scss'],
})
export class BusinessProfileMobilePage implements OnInit {

  public user: User;
  public readonly userStatusEnum = UserStatus;

  constructor(
      private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    this.user = this.sessionStorageService.getObject<User>('user');
  }

}
