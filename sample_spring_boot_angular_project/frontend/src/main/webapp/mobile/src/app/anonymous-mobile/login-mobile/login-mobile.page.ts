import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SocialUser } from '../../../../../web/src/app/anonymous/anonymous.model';
import { AnonymousService } from '../../../../../web/src/app/anonymous/anonymous.service';
import { Token } from '../../../../../web/src/app/auth/auth.model';
import { CallbackHandlerService } from '../../../../../web/src/app/utils/callback-handler.service';
import { LocalStorageService } from '../../../../../web/src/app/utils/storage/local-storage.service';
import { ToasterConfigService } from '../../../../../web/src/app/utils/toaster-config.service';

@Component({
  selector: 'zum-login-mobile',
  templateUrl: './login-mobile.page.html',
  styleUrls: ['./login-mobile.page.scss'],
})
export class LoginMobilePage {

  public isBtnDisabled = false;

  constructor(
      private router: Router,
      private facebook: Facebook,
      private anonymousService: AnonymousService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private localStorageService: LocalStorageService,
      private keyboard: Keyboard
  ) { }

  //
  public loginFacebook() {
    const permissions = ['public_profile', 'email'];

    this.isBtnDisabled = true;

    this.facebook.login(permissions)
    .then((response) => {
          const facebookUser = new SocialUser();
          facebookUser.token = response.authResponse.accessToken;

          this.facebook
          .api('/me?fields=id,email,first_name,last_name', [])
          .then(
              (res) => {
                console.log('res', res);
                facebookUser.email = res.email;
                this.facebook.logout();

                const token = {} as Token;
                token.token = facebookUser.token;

                if (!facebookUser.email) {
                  // If user already exist in system - login him w/o mail
                  this.anonymousService.checkFacebookUser(token).subscribe(
                      (data) => {
                        if (data.exist === true) {
                          this.loginWithFacebook(facebookUser);
                        } else {
                          this.localStorageService.setObject('socialUser', facebookUser);

                          this.router.navigate(['/register/email']);
                        }
                      }
                  );
                } else {
                  this.loginWithFacebook(facebookUser);
                }
              },
              (error) => {
                this.facebook.logout();
                console.log('ERROR LOGIN: ', error);
                this.isBtnDisabled = false;
              });
        },

        (error) => {
          this.isBtnDisabled = false;
          console.log(error);
        });
  }

  private loginWithFacebook(facebookUser: SocialUser): void {
    this.anonymousService.authWithFacebook(facebookUser).subscribe(
        (data) => {
          // Save token to local storage
          this.localStorageService.set('authToken', data.token);

          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.socialLoginErrorHandler(error);
        });
  }

  private socialLoginErrorHandler(error) {
    this.isBtnDisabled = false;

    // FIXME
    if (error.status === 401) {
      this.toaster.error('Registered with another social media.');
    } else {
      this.toaster.error(this.callbackService.getErrorMessage(error));
    }
  }

  public hideKeyboard(): void {
    if (this.keyboard.isVisible === true) {
      this.keyboard.hide();
    } else {
      return;
    }
  }
}
