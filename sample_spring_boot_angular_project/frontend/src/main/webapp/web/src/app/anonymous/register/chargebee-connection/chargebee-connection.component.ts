import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, Input, NgZone, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { environment } from '../../../../../../environments/environment';
import { BrowserServiceProvider } from '../../../utils/browser.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ChargbeeSubscriptionData } from '../../anonymous.model';
import { AnonymousService } from '../../anonymous.service';
import { MessagesService } from '../../../utils/messages.service';

declare const Chargebee: any;

@Component({
  selector: 'zu-chargebee-connection',
  templateUrl: './chargebee-connection.component.html',
  styleUrls: ['./chargebee-connection.component.scss']
})
export class ChargebeeConnectionComponent implements OnInit, AfterViewInit {
  @Input() disabled: Function;

  public cbInstance;
  private prefix = '/api/protected';
  private subscriptionId: ChargbeeSubscriptionData;

  private platform: Platform;
  private browserService: BrowserServiceProvider;
  public isMobile: boolean;
  public isRequestSucceed = false;

  constructor(
      private httpClient: HttpClient,
      private toaster: ToasterConfigService,
      private anonymousService: AnonymousService,
      private zone: NgZone,
      private router: Router,
      private messagesService: MessagesService,
      private injector: Injector
  ) {

    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }

    try {
      this.browserService = injector.get(BrowserServiceProvider);
    } catch (e) {
    }

    try {
      if (this.platform.is('mobile')) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    } catch (e) {
      this.isMobile = false;
    }
  }

  ngOnInit() {
    this.connectToChargebee();
    this.subscriptionId = new ChargbeeSubscriptionData();
  }

  ngAfterViewInit(): void {
    Chargebee.registerAgain();
  }

  private connectToChargebee(): void {
    if (typeof window !== 'undefined' && typeof window['Chargebee'] !== 'undefined') {

      this.cbInstance = window['Chargebee'].init({
        site: environment.chargebeeHost
      });
    }
  }

  private getFormUrlEncoded(toConvert) {
    const formBody = [];

    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }

  public openCheckoutInBrowser(): void {
    try {
      if (this.platform.is('mobile')) {
        this.browserService.openBrowser(environment.baseUrl + '/login');
//        this.browserService.openBrowser(environment.baseUrl + '/login');
        return;
      }
    } catch (e) {
    }
  }

  public openCheckout(): void {

    this.cbInstance.logout();
    this.cbInstance.openCheckout({
      hostedPage: () => {
        return this.httpClient.post(
            `${this.prefix}/subscriptions/checkout`,
            this.getFormUrlEncoded({plan_id: 'shootzu-annual-membership'}),
            {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}
        ).toPromise();
      },
      loaded: () => {},
      close: () => {
        this.zone.run(() => {
          this.SendHostedId();
        });
      },
      success: (hostedPageId) => {
        this.zone.run(() => {
          this.isRequestSucceed = true;
          this.subscriptionId.hostedPageId = hostedPageId;
        });
      }
    });
  }

  private SendHostedId(): void {
    if (this.subscriptionId.hostedPageId !== '') {
      this.anonymousService.createChargebeeSubscription(this.subscriptionId).subscribe(
          () => {
            this.messagesService.showSuccess('register.chargebee_connection.message_success');
            this.router.navigate(['/business-profile']);
          },
          () => {
            this.messagesService.showError('common.message_error');
          }
      );
    }
  }
}
