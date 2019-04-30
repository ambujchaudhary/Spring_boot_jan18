import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GuardsCheckEnd, NavigationEnd, ResolveEnd, Router } from '@angular/router';

import { Nav, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subject } from 'rxjs/Subject';
import { RouterDirectionDirective } from '../../../web/src/app/shared/router-direction.directive';

@Component({
  selector: 'zum-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('view') nav: Nav;

  public appPages = [
    {
      title: 'server-unavailable',
      url: '/server-unavailable',
      icon: 'information-circle'
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'home'
    },
    {
      title: 'Login',
      url: '/login',
      icon: 'key'
    },
    {
      title: 'Register',
      url: '/register',
      icon: 'key'
    },
    {
      title: 'Business profile',
      url: '/business-profile',
      icon: 'home'
    },
    {
      title: 'Choose your country',
      url: '/choose-your-country',
      icon: 'jet'
    },
    {
      title: 'Profile',
      url: 'profile',
      icon: 'body',
    },
    {
      title: 'Profile/pending',
      url: 'profile/pending',
      icon: 'contact',
    },
    {
      title: 'Profile/:id',
      url: 'profile/1',
      icon: 'contacts',
    },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'construct',
    },
  ];

  public showMenu = false;
  private unsubscribe: Subject<void> = new Subject<void>();
  private scrollToTop: number;

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private navCtrl: NavController,
      private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    this.router.events.subscribe((event) => {
      // console.log('> router event:', event);
      if (event instanceof NavigationEnd === false && event instanceof ResolveEnd === false && event instanceof GuardsCheckEnd === false) {
        return;
      }

      // console.log('> router navCtrl');

      this.applyMobileAppRoutes();

      this.scrollToTop = window.setInterval(
          () => {
            const pos = window.pageYOffset;
            if (pos > 0) {
              window.scrollTo(0, pos - 20); // how far to scroll on each step
            } else {
              window.clearInterval(this.scrollToTop);
            }
          },
          0);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private applyMobileAppRoutes() {
    if (this.navCtrl && this.navCtrl.setIntent) {
      try {
        this.navCtrl.setIntent(RouterDirectionDirective.textToIntent('root'));
      } catch (e) {
      }
    }
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
