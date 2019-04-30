import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FacebookUser, GoogleUser } from '../../../../../web/src/app/anonymous/anonymous.model';
import { AnonymousService } from '../../../../../web/src/app/anonymous/anonymous.service';
import { Token } from '../../../../../web/src/app/auth/auth.model';
import { CallbackHandlerService } from '../../../../../web/src/app/utils/callback-handler.service';
import { LocalStorageService } from '../../../../../web/src/app/utils/storage/local-storage.service';
import { ToasterConfigService } from '../../../../../web/src/app/utils/toaster-config.service';

@Component({
  selector: 'zum-register-mobile',
  templateUrl: './register-mobile.page.html',
  styleUrls: ['./register-mobile.page.scss'],
})
export class RegisterMobilePage {

  constructor(
      private router: Router,
      private facebook: Facebook,
      private googlePlus: GooglePlus,
      private anonymousService: AnonymousService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private localStorageService: LocalStorageService
  ) { }

  public registerGoogle() {
    console.log('registerGoogle');

    this.googlePlus.login({})
    .then(
        (res) => {
          console.log(res);
          this.registerWithGoogle(res);
        },
        (err) => {
          console.log('err', err);
        }
    )
    .catch(
        (err) => console.error(err)
    );
  }

  //
  public registerFacebook() {
    const permissions = ['public_profile', 'email'];

    this.facebook.login(permissions).then((response) => {
          const params = new Array<string>();

          this.facebook
          .api('/me?fields=id,email,first_name,last_name', params)
          .then(
              (res) => {
                console.log('res', res);
                const facebookUser = new FacebookUser();
                facebookUser.id = res.id;
                facebookUser.email = res.email;
                facebookUser.firstName = res.first_name;
                facebookUser.lastName = res.last_name;

                this.registerWithFacebook(facebookUser);
              },
              (error) => {
                console.log('ERRO register: ', error);
              });
        },
        (error) => {
          alert(error);
        });
  }

  private registerWithFacebook(facebookUser: FacebookUser): void {
    this.anonymousService.mobileAuthWithFacebook(facebookUser).subscribe(
        (data: Token) => {
          console.log('registerWithFacebook', data);
          console.log('facebookUser', facebookUser);

          this.localStorageService.set('authToken', data.token);

          if (facebookUser.email) {
            this.router.navigate(['/register/social']);
          } else {
            this.router.navigate(['/register/email']);
          }
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
  }

  private registerWithGoogle(googleUser: GoogleUser): void {
    this.anonymousService.mobileAuthWithGoogle(googleUser).subscribe(
        (data: Token) => {
          console.log('registerWithGoogle', data);
          console.log('googleUser', googleUser);

          this.localStorageService.set('authToken', data.token);

          this.router.navigate(['/register/social']);
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });
  }

}
