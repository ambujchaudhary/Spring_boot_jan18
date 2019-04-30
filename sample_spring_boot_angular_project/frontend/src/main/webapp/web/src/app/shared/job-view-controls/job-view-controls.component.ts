import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, AfterViewInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ChargbeeSubscriptionData, MembershipTypeEnum } from '../../anonymous/anonymous.model';
import { AnonymousService } from '../../anonymous/anonymous.service';
import { User } from '../../auth/auth.model';
import { ChargebeeUtilsService } from '../../utils/chargebee-utils.service';
import { JobUtilsService } from '../../utils/job-utils.service';
import { SessionStorageService } from '../../utils/storage/session-storage.service';
import { ChatNewMessage } from '../chat/chat.model';
import { ChatService } from '../chat/chat.service';
import { SendMessageModalComponent } from '../../user/profile/profile-view/send-message-modal/send-message-modal.component';
import { CompleteJobModalComponent } from '../../user/job/job-summary/job-summary-footer/complete-job-modal/complete-job-modal.component';
import { CompleteJobModalData, Job, JobReport, JobStatusEnum, OwnershipTypeEnum, PurchaseMembershipModalData } from '../../user/job/job.model';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { AcceptOfferModalComponent } from '../../user/job/job-view/accept-offer-modal/accept-offer-modal.component';
import { CancelApplicationModalComponent } from '../../user/job/job-view/cancel-application-modal/cancel-application-modal.component';
import { JobService } from '../../user/job/job.service';
import { MessagesService } from '../../utils/messages.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { CallbackHandlerService, ZuResponse } from '../../utils/callback-handler.service';
import { DeclineOfferModalComponent } from '../../user/job/job-view/decline-offer-modal/decline-offer-modal.component';
import { ApplicationSentModalComponent } from './application-sent-modal/application-sent-modal.component';
import { BuyMembershipModalComponent } from './buy-membership-modal/buy-membership-modal.component';
import { ShooterInfoForMessage } from './job-view-controls.model';

declare const Chargebee: any;

@Component({
  selector: 'zu-job-view-controls',
  templateUrl: './job-view-controls.component.html',
  styleUrls: ['./job-view-controls.component.scss']
})
export class JobViewControlsComponent implements OnInit, AfterViewInit {

  @Input() ownershipType: OwnershipTypeEnum;
  @Input() job: Job;

  @Output() onChangeJobStatus: EventEmitter<any> = new EventEmitter();

  public jobId: number;
  public starsCount: number;
  public isRequestInProgress = false;
  private jobReport: JobReport;
  private user: User;

  private messageToSend: ChatNewMessage;
  private shooterInfo: ShooterInfoForMessage;

  public readonly ownershipTypeEnum = OwnershipTypeEnum;
  public readonly jobStatusEnum = JobStatusEnum;

  public cbInstance;
  private prefix = '/api/protected';
  private subscriptionId: ChargbeeSubscriptionData;

  public readonly membershipTypeEnum = MembershipTypeEnum;

  public isApplyButtonDisabled = false;

  public platform: Platform;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private dialog: MatDialog,
              private jobService: JobService,
              private messagesService: MessagesService,
              private router: Router,
              private callbackHandlerService: CallbackHandlerService,
              private toaster: ToasterConfigService,
              private jobUtilService: JobUtilsService,
              private chatService: ChatService,
              private sessionStorageService: SessionStorageService,
              private httpClient: HttpClient,
              private anonymousService: AnonymousService,
              private zone: NgZone,
              private injector: Injector,
              private chargebeeService: ChargebeeUtilsService
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    this.jobReport = new JobReport();

    this.getUserInfo();
    this.getShooterInfoForMessage();

    this.cbInstance = this.chargebeeService.connectToChargebee();
    this.subscriptionId = new ChargbeeSubscriptionData();
  }

  ngAfterViewInit(): void {
    Chargebee.registerAgain();
  }

  private acceptOffer() {
    this.job.status = this.jobStatusEnum.OFFER_ACCEPTED;
    this.jobService.acceptJobOffer(this.jobId).subscribe(
        () => {
          this.messagesService.showSuccess('job.accept_offer.success');
        },
        () => {
          this.messagesService.showError('job.offer_error.message_error');
          this.job.status = this.jobStatusEnum.WAITING_FOR_RESPONSE;
        });
  }

  private declineOffer() {
    this.job.status = this.jobStatusEnum.NEW;
    this.jobService.declineJobOffer(this.jobId).subscribe(
        () => {
          this.messagesService.showSuccess('job.decline_offer.success');
        },
        () => {
          this.messagesService.showError('job.offer_error.message_error');
          this.job.status = this.jobStatusEnum.WAITING_FOR_RESPONSE;
        });
  }

  private completeJob(): void {
    this.jobReport.star = this.jobUtilService.getStarsByValue(this.starsCount);
    this.job.status = JobStatusEnum.COMPLETED;

    this.jobService.completeJob(this.jobReport, this.jobId).subscribe(
        () => {
          this.messagesService.showSuccess('complete_job.complete_job_success');
        },
        () => {
          this.job.status = JobStatusEnum.IN_PROGRESS;
          this.messagesService.showError('common.message_error');
        }
    );
  }

  private getUserInfo(): void {
    this.user = this.sessionStorageService.getObject<User>('user');
  }

  private getShooterInfoForMessage(): void {

    const hired = (this.job.applicants || []).find((i) => i.hired === true);

    if (hired && hired.id) {
      this.shooterInfo = new ShooterInfoForMessage(hired.id, hired.firstName, hired.lastName);
    }
  }

  private getUserNameForModal(): string {
    if (this.ownershipType === this.ownershipTypeEnum.OWNER) {
      return `${this.shooterInfo.firstName} ${this.shooterInfo.lastName}`;
    } else {
      return this.job.ownerName;
    }
  }

  private sendMessage(): void {
    this.isRequestInProgress = true;
    this.chatService.send(this.messageToSend)
    .finally(
        () => {
          this.isRequestInProgress = false;
        }
    )
    .subscribe(
        () => {
          this.messagesService.showSuccess('send_message.message_send_success');
        },
        (error) => {
          this.messagesService.showError('send_message.message_send_error');
        }
    );
  }

  private openExtendMembershipModal(): void {
    this.isApplyButtonDisabled = true;

    const modalData = new PurchaseMembershipModalData(
        'Upgrade your membership',
        'Oh no! Your free membership has hit its limit. Upgrade your' +
        ' Zu membership to be able to apply and post Jobs. You can stay on the Free tier if you just want to browse.');

    const dialogRef = this.dialog.open(BuyMembershipModalComponent, {
      panelClass: ['purchase-membership-modal', 'public-page-backgroud'],
      data: modalData
    });

    dialogRef.afterClosed().subscribe(
        (result: MembershipTypeEnum) => {
          switch (result) {
            case this.membershipTypeEnum.MONTHLY:
              this.openCheckout(this.membershipTypeEnum.MONTHLY);
              break;
            case this.membershipTypeEnum.ANNUAL:
              this.openCheckout(this.membershipTypeEnum.ANNUAL);
              break;
            default:
              this.toaster.error('You should subscribe new membership to apply for job!');
              this.isApplyButtonDisabled = false;
          }
        }
    );
  }

  private openCheckout(id: MembershipTypeEnum): void {

    this.cbInstance.logout();
    this.cbInstance.openCheckout({
      hostedPage: () => {
        return this.httpClient.post(
            `${this.prefix}/subscriptions/checkout`,
            this.chargebeeService.getFormUrlEncoded({plan_id: id}),
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
          this.subscriptionId.hostedPageId = hostedPageId;
        });
      }
    });
  }

  private SendHostedId(): void {
    if (this.subscriptionId.hostedPageId !== '') {
      this.anonymousService.createChargebeeSubscription(this.subscriptionId)
      .finally(
          () => {
            this.isApplyButtonDisabled = false;
          }
      )
      .subscribe(
          () => {
            this.toaster.success('Membership created!');
            this.applyForJob();
          },
          () => {
            this.messagesService.showError('common.message_error');
          }
      );
    } else {
      this.toaster.error('You should subscribe new membership to apply for job!');
      this.isApplyButtonDisabled = false;
    }
  }

  private isMobile(): boolean {
    try {
      if (this.platform.is('mobile')) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  public goBack() {
    this.location.back();
  }

  public backToJobList() {
    if (this.route.snapshot.queryParams['relative']) {
      this.router.navigate(['/jobs']);
    } else if (this.route.snapshot.queryParams['fromProfile']) {
      this.router.navigate(['/jobs']);
    } else {
      this.location.back();
    }
  }

  public cancelApplication() {
    this.toaster.hide();

    this.jobService.cancelApplication(this.jobId).subscribe(
        (data: ZuResponse) => {
          this.router.navigate(['/find-job']);
          this.messagesService.show(data.message, 'success');
        },
        (errorData: any) => {
          this.toaster.error(this.callbackHandlerService.getErrorMessage(errorData));
        });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(CancelApplicationModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.cancelApplication();
          }
        }
    );
  }

  public openAcceptOfferDialog(): void {
    const dialogRef = this.dialog.open(AcceptOfferModalComponent, {
      data: {
        job: this.job,
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.acceptOffer();
          }
        }
    );
  }

  public openDeclineOfferDialog(): void {
    const dialogRef = this.dialog.open(DeclineOfferModalComponent);

    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.declineOffer();
          }
        }
    );
  }

  public openCompleteJobDialog(): void {
    const dialogRef = this.dialog.open(CompleteJobModalComponent, {
      data: {
        id: this.jobId
      },
      panelClass: 'accept-offer-modal'
    });

    dialogRef.afterClosed().subscribe((data: CompleteJobModalData) => {
          if (typeof data !== 'undefined' && data.result === true) {
            this.jobReport.review = data.review;
            this.starsCount = data.rate;
            this.completeJob();
          }
        }
    );
  }

  public applyForJob(): void {
    this.toaster.hide();

    this.jobService.applyForJob(this.jobId).subscribe(
        (data: ZuResponse) => {
          this.onChangeJobStatus.emit();

          this.dialog.open(ApplicationSentModalComponent, {
            panelClass: 'accept-offer-modal',
            data: this.jobId
          });
        },
        (errorData: any) => {
          if (errorData.status === 403 && this.isMobile() === false) {
            this.openExtendMembershipModal();
          } else if (errorData.status === 403 && this.isMobile() === true) {
            this.toaster.error('You should subscribe new membership on WEB app.');
          } else {
            this.toaster.error(this.callbackHandlerService.getErrorMessage(errorData));
          }
        });
  }

  public openSendMessageModal(): void {
    const dialogRef = this.dialog.open(SendMessageModalComponent, {
      data: {
        recipientName: this.getUserNameForModal()
      },
      panelClass: 'send-message-modal'
    });

    dialogRef.afterClosed().subscribe((data) => {
          if (data.result === true) {
            // Check who send a message
            const recipientId = this.ownershipType === this.ownershipTypeEnum.OWNER ? this.shooterInfo.id.toString() : this.job.ownerId;

            this.messageToSend = new ChatNewMessage(this.jobId.toString(), recipientId, this.user.id, data.message);

            this.sendMessage();
          }
        }
    );
  }
}
