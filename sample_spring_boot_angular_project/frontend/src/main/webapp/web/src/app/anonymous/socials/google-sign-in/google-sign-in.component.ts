import { Component, Input, NgZone, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { SocialUser } from '../../anonymous.model';
import { AnonymousService } from '../../anonymous.service';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { Router } from '@angular/router';

const options = {
  client_id: '75034130352-ncl27saeuou8pujpinfcgridnisq00p6.apps.googleusercontent.com',
  scope: 'profile email'
};

declare const gapi: any;

@Component({
  selector: 'zu-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss']
})
export class GoogleSignInComponent implements OnInit {

  @Input() actionButtonText: string;
  @Input() isMobile: boolean;

  constructor(private anonymousService: AnonymousService,
              private callbackService: CallbackHandlerService,
              private toaster: ToasterConfigService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private zone: NgZone,
              private inAppBrowser: InAppBrowser
  ) { }

  ngOnInit() {
    this.initGoogleAuth();
  }

  private initGoogleAuth(): void {
    // Load Google API
    if (this.isMobile) {
      return;
    } else {
      gapi.load('auth2', () => {
        gapi.auth2.init(options).then(
            () => {}
        );
      });
    }
  }

  private loginWithGoogle(userGoogle: SocialUser): void {
    this.zone.run(
        () => {
          this.anonymousService.authWithGoogle(userGoogle).subscribe(
              (data) => {
                // Save token to local storage
                this.localStorageService.set('authToken', data.token);

                this.router.navigate(['/']);
              },
              (error) => {
                this.toaster.error(this.callbackService.getErrorMessage(error));
              });
        });
  }

  public googleLogin(): void {
    if (this.isMobile === true) {
      const link = `https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&redirect_uri=${window.location.origin}/dashboard&response_type=id_token&nonce=42&prompt=select_account&client_id=75034130352-ncl27saeuou8pujpinfcgridnisq00p6.apps.googleusercontent.com`;

      const browserRef = this.inAppBrowser.create(link, '_blank', 'location=no');

      //            TODO
      browserRef.on('loadstart').subscribe(
          (event: InAppBrowserEvent) => {
            if (event.url.startsWith('https://dev') ||
                event.url.startsWith('https://app.shootzu') ||
                event.url.startsWith('http://localhost')) {
              browserRef.close();

              const token = event.url.split('id_token=')[1];
              const userGoogle = new SocialUser();
              userGoogle.token = token;
              this.loginWithGoogle(userGoogle);
            }
          }
      );
    } else {
      const googleAuth = gapi.auth2.getAuthInstance();

      this.zone.run(
          () => {
            googleAuth.then(() => {
              googleAuth.signIn({prompt: 'select_account'})
              .then((googleUser) => {

                // Get Google ID token
                const userGoogle = new SocialUser();
                userGoogle.token = googleUser.getAuthResponse().id_token;

                // Logout from google after success
                gapi.auth2.getAuthInstance().signOut();

                // Sign in with the back-end service
                this.loginWithGoogle(userGoogle);
              });
            })
            .catch((error) => {
              console.log(error);
            });
          }
      );
    }
  }
}
