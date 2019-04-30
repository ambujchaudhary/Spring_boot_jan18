import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { environment } from '../../../../../../environments/environment';
import { ChargbeeSubscriptionData, MembershipTypeEnum } from '../../../anonymous/anonymous.model';
import { AnonymousService } from '../../../anonymous/anonymous.service';
import { ChargebeeUtilsService } from '../../../utils/chargebee-utils.service';
import { MessagesService } from '../../../utils/messages.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { BuyMembershipModalComponent } from '../../../shared/job-view-controls/buy-membership-modal/buy-membership-modal.component';
import { PurchaseMembershipModalData } from '../../job/job.model';
import { SubscriptionTypeEnum } from '../settings.model';

declare const Chargebee: any;

@Component({
  selector: 'zu-manage-payment-details',
  templateUrl: './manage-payment-details.component.html',
  styleUrls: ['./manage-payment-details.component.scss']
})
export class ManagePaymentDetailsComponent implements OnInit {
  @Input() type: 'paymentPortal' | 'subscriptionsModal';
  @Input() currentSubscriptionsType: SubscriptionTypeEnum[];
  @Output() successSubscriptionCreatedEmitter = new EventEmitter();

  public cbInstance;

  private prefix: string;
  private baseUrl = environment.baseUrl;

  public isRequestInProgress = false;
  private subscriptionId: ChargbeeSubscriptionData;
  private readonly membershipTypeEnum = MembershipTypeEnum;

  constructor(
      private httpClient: HttpClient,
      private chargebeeService: ChargebeeUtilsService,
      private dialog: MatDialog,
      private messagesService: MessagesService,
      private toaster: ToasterConfigService,
      private zone: NgZone,
      private anonymousService: AnonymousService
  ) {
    this.prefix = this.baseUrl + 'api/protected';
  }

  ngOnInit() {
    this.cbInstance = this.chargebeeService.connectToChargebee();

    if (this.type === 'paymentPortal') {
      this.connectToPortal();
    }

    if (this.type === 'subscriptionsModal') {
      this.subscriptionId = new ChargbeeSubscriptionData();
    }
  }

  private connectToPortal(): void {
    this.cbInstance.setPortalSession(() => {
      return this.httpClient.post(
          `${this.prefix}/subscriptions/portal`,
          this.chargebeeService.getFormUrlEncoded({}),
          {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}).toPromise();
    });
  }

  private SendHostedId(): void {
    if (this.subscriptionId.hostedPageId !== '') {
      this.anonymousService.createChargebeeSubscription(this.subscriptionId)
      .finally(
          () => {
            this.isRequestInProgress = false;
          }
      )
      .subscribe(
          () => {
            this.toaster.success('Subscription created!');
            this.successSubscriptionCreatedEmitter.emit();
            this.subscriptionId.hostedPageId = '';
          },
          () => {
            this.messagesService.showError('common.message_error');
          }
      );
    } else {
      this.isRequestInProgress = false;
    }
  }

  private openCheckout(id: MembershipTypeEnum): void {
    if (this.type === 'subscriptionsModal') {
      Chargebee.registerAgain();
    }

    this.cbInstance.logout();

    this.cbInstance.openCheckout({
      hostedPage: () => {
        return this.httpClient.post(
            `${this.prefix}/subscriptions/checkout`,
            this.chargebeeService.getFormUrlEncoded({plan_id: id}),
            {headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})}
        ).toPromise();
      },

      close: () => {
        this.zone.run(() => {
          this.SendHostedId();
        });
      },

      success: (hostedPageId) => {
        this.zone.run(() => {
          this.subscriptionId.hostedPageId = hostedPageId;
        });
      }
    });
  }

  public openPortal() {
    this.cbInstance.createChargebeePortal().open({});
  }

  public openManageMembershipModal(): void {
    this.isRequestInProgress = true;

    const modalData = new PurchaseMembershipModalData('Change your membership',
        `${this.currentSubscriptionsType} already selected as active/future membership`, this.currentSubscriptionsType);

    const dialogRef = this.dialog.open(BuyMembershipModalComponent, {
      panelClass: ['purchase-membership-modal', 'public-page-backgroud', 'purchase-membership-modal__with-free-block'],
      data: modalData
    });

    dialogRef.afterClosed().subscribe(
        (result: MembershipTypeEnum) => {
          switch (result) {
            case this.membershipTypeEnum.FREE:
              this.anonymousService.createFreeSubscription()
              .finally(
                  () => {
                    this.isRequestInProgress = false;
                  }
              )
              .subscribe(
                  () => {
                    this.toaster.success('Subscription created!');
                    this.successSubscriptionCreatedEmitter.emit();
                  },
                  () => {
                    this.messagesService.showError('common.message_error');
                  }
              );
              break;
            case this.membershipTypeEnum.MONTHLY:
              this.openCheckout(this.membershipTypeEnum.MONTHLY);
              break;
            case this.membershipTypeEnum.ANNUAL:
              this.openCheckout(this.membershipTypeEnum.ANNUAL);
              break;
            default:
              this.isRequestInProgress = false;
          }
        }
    );
  }
}
