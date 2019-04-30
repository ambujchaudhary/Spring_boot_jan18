import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { PublicUserProfileData } from '../../../admin/admin.model';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { UserService } from '../../user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewResolverService {

  constructor(private userService: UserService,
              private callbackService: CallbackHandlerService,
              private toaster: ToasterConfigService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PublicUserProfileData> | Promise<PublicUserProfileData> | PublicUserProfileData {
    const profileId = route.paramMap.get('id');
    return this.userService.getUserProfilePreview(profileId).catch((data) => {
      this.toaster.error(this.callbackService.getErrorMessage(data.error));
      return Observable.empty();
    });
  }
}
