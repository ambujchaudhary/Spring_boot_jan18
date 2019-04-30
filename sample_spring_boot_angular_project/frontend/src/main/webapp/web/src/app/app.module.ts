import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';
import { AdminModule } from './admin/admin.module';
import { AnonymousModule } from './anonymous/anonymous.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthModule } from './auth/auth.module';

import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';
import { stompConfig } from './utils/web-sockte/web-sockte.model';

import { MaterialComponents } from './utils/zu-material-components.module';

import { StompConfig, StompService } from '@stomp/ng2-stompjs';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialComponents,

    AnonymousModule,
    AdminModule,
    AuthModule,
    UserModule,
    /* AppRoutingModule must be last */
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    AuthService,
    InAppBrowser,
    SafariViewController,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    },
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
