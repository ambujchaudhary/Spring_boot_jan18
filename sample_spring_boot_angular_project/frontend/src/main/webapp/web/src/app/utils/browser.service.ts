import { Injectable, Injector } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

@Injectable()
export class BrowserServiceProvider {

  private platform: Platform;

  constructor(
      private inAppBrowser: InAppBrowser,
      private safariViewController: SafariViewController,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  public openBrowser(url: string): void {
    try {
      if (this.platform.is('ios')) {
        this.openSafariViewController(url);
      } else if (this.platform.is('android')) {
        this.openSystemBrowser(url);
      } else {
        this.openInAppBrowser(url);
      }
    } catch (e) {
      this.openInAppBrowser(url);
    }
  }

  private openSafariViewController(url: string): void {
    this.safariViewController.isAvailable().then((available: boolean) => {
      if (available) {
        this.safariViewController
        .show({
          url,
          hidden: false,
          animated: true,
          transition: 'curl',
          enterReaderModeIfAvailable: true,
          tintColor: '#488aff'
        })
        .subscribe(
            (result: any) => {
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'loaded') {
                console.log('Loaded');
              } else if (result.event === 'closed') {
                console.log('Closed');
              }
            },
            (error: any) => console.error(error)
        );
      } else {
        // fallback for iOS 9.0 and lower
        this.openInAppBrowser(url);
      }
    });
  }

  private openSystemBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  private openInAppBrowser(url: string): void {
    this.inAppBrowser.create(url, '_blank');
  }
}
