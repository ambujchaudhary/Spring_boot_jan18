import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera/ngx';

import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { AuthInterceptor } from '../../../web/src/app/auth/auth-interceptor';
import { AuthService } from '../../../web/src/app/auth/auth.service';
import { stompConfig } from '../../../web/src/app/utils/web-sockte/web-sockte.model';
import { BrowserServiceProvider } from '../../../web/src/app/utils/browser.service';
import { MaterialComponents } from '../../../web/src/app/utils/zu-material-components.module';
import { AdminMobileRoutingModule } from './admin-mobile/admin-mobile-routing.module';
import { AdminMobileModule } from './admin-mobile/admin-mobile.module';
import { AnonymousMobileRoutingModule } from './anonymous-mobile/anonymous-mobile-routing.module';
import { AnonymousMobileModule } from './anonymous-mobile/anonymous-mobile.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthMobileRoutingModule } from './auth-mobile/auth-mobile-routing.module';
import { AuthMobileModule } from './auth-mobile/auth-mobile.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserMobileRoutingModule } from './user-mobile/user-mobile-routing.module';
import { UserMobileModule } from './user-mobile/user-mobile.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

const config = {
  
};

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,

    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialComponents,

    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),

    AnonymousMobileRoutingModule,
    AuthMobileRoutingModule,
    UserMobileRoutingModule,
    AdminMobileRoutingModule,
    AppRoutingModule,

    AdminMobileModule,
    AnonymousMobileModule,
    AuthMobileModule,
    UserMobileModule,

    HttpClientModule,

    AngularFireModule.initializeApp(config),
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    InAppBrowser,
    Camera,
    SafariViewController,
    BrowserServiceProvider,
    StompService,
    {provide: StompConfig, useValue: stompConfig},
    StatusBar,
    Facebook,
    GooglePlus,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    AuthInterceptor,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    Firebase,
    Keyboard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
