import { Component, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from '../../../auth/auth.model';
import { SocialUser } from '../../anonymous.model';
import { AnonymousService } from '../../anonymous.service';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';

declare const FB: any;

@Component({
  selector: 'zu-facebook-sign-in',
  templateUrl: './facebook-sign-in.component.html',
  styleUrls: ['./facebook-sign-in.component.scss']
})
export class FacebookSignInComponent {

  @Input() actionButtonText: string;

  constructor(private anonymousService: AnonymousService,
              private callbackService: CallbackHandlerService,
              private toaster: ToasterConfigService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private validationService: ValidationService,
              private zone: NgZone
  ) { }

  private loginWithFacebook(facebookUser: SocialUser): void {
    this.zone.run(
        () => {
          this.anonymousService.authWithFacebook(facebookUser).subscribe(
              (data) => {
                // Save token to local storage
                this.localStorageService.set('authToken', data.token);

                this.router.navigate(['/dashboard']);
              },
              (error) => {
                this.toaster.error(this.callbackService.getErrorMessage(error));
              });
        });
  }

  public facebookLogin(): void {
    this.zone.run(
        () => {
          FB.login(
              (response) => {
                this.zone.run(
                    () => {
                      if (response.authResponse) {
                        // Get Facebook ID token

                        const facebookUser = new SocialUser();

                        facebookUser.token = response.authResponse.accessToken;
                        // Get Facebook user info
                        FB.api('/me', {fields: 'name,email'}, (res) => {
                          this.zone.run(
                              () => {
                                facebookUser.email = res.email;

                                // Check if facebook user have email
                                if (typeof facebookUser.email === 'undefined' ||
                                    this.validationService.isStringNotEmpty(facebookUser.email) === false) {
                                  const token = {} as Token;
                                  token.token = facebookUser.token;

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
                                  // Login with the back-end service
                                  this.loginWithFacebook(facebookUser);
                                }
                              });
                        });
                      }
                    }, {display: 'touch'});
              });
        });
  }
}
