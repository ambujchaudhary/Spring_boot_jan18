import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicUserProfileData } from '../../../admin/admin.model';
import { AuthService } from '../../../auth/auth.service';
import { CallbackHandlerService, ZuResponse } from '../../../utils/callback-handler.service';
import { MessagesService } from '../../../utils/messages.service';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { Job, JobApplicants, JobStatusEnum } from '../../job/job.model';
import { JobService } from '../../job/job.service';
import { ChatNewMessage } from '../../../shared/chat/chat.model';
import { ChatService } from '../../../shared/chat/chat.service';
import { UserService } from '../../user.service';
import { ConfirmOfferModalComponent } from './confirm-offer-modal/confirm-offer-modal.component';
import { OfferSentModalComponent } from './offer-sent-modal/offer-sent-modal.component';
import { SendMessageModalComponent } from './send-message-modal/send-message-modal.component';
import { SendOfferModalComponent } from './send-offer-modal/send-offer-modal.component';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'zu-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, AfterViewInit {
  @Input() isMobile = false;
  private isOfferAlreadySent = false;

  public profileId = this.route.snapshot.params['id'];
  public userId: string;
  public job: Job;
  private jobId = this.route.snapshot.queryParams['jobId'];
  public profilePreview: PublicUserProfileData;
  public isRequestInProgress = false;
  public isJobIdValid = true;
  public isSendOfferHidden = false;

  private messageToSend: ChatNewMessage;

  public readonly jobStatusEnum = JobStatusEnum;

  public messageLabel = 'Oops! We need some more information before we can set up your Shootzu profile:';

  constructor(
      private location: Location,
      private userService: UserService,
      private route: ActivatedRoute,
      private callbackService: CallbackHandlerService,
      private toaster: ToasterConfigService,
      private dialog: MatDialog,
      private jobService: JobService,
      private messagesService: MessagesService,
      private authService: AuthService,
      private chatService: ChatService,
      private router: Router,
      private localStorageService: LocalStorageService,
      private inAppBrowser: InAppBrowser
  ) {}

  ngOnInit() {
    this.route.data.subscribe(
        (data: {profile: PublicUserProfileData}) => {
          this.setProfilePreview(data.profile);
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        });

    this.getJobDetails();

    this.getUserId();
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.route.queryParams.subscribe((params) => {
        if (params['redirect_flow_id']) {
          this.openConfirmOfferModal(params['redirect_flow_id']);
        }
        if (params['offerSent']) {
          this.openOfferSentModal();
        }
      });
    });
  }

  private openConfirmOfferModal(id: string): void {

    const canseledJobId = this.localStorageService.get('offerTransactionComplete');

    if (canseledJobId && canseledJobId === this.jobId) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmOfferModalComponent, {
      data: null,
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
          if (data === true) {
            this.jobService.confirmGocardlessOffer(this.jobId, this.profileId, id, !!data).finally(
                () => {
                  this.getJobDetails();
                  this.router.navigate([`profile/${this.profileId}`], {queryParams: {jobId: this.jobId, offerSent: true}, replaceUrl: true});
                })
            .subscribe(
                (res: ZuResponse) => {
                  if (res.success === true) {
                    this.job.status = this.jobStatusEnum.WAITING_FOR_RESPONSE;
                    this.localStorageService.delete('offerTransactionComplete');
                  } else {
                    this.localStorageService.set('offerTransactionComplete', this.jobId);
                  }
                },
                (err) => {
                  console.log(err);
                  this.localStorageService.set('offerTransactionComplete', this.jobId);
                }
            );
          } else {
            this.router.navigate([`profile/${this.profileId}`], {queryParams: {jobId: this.jobId}, replaceUrl: true});
          }
        }
    );
  }

  private setProfilePreview(data: PublicUserProfileData) {
    this.profilePreview = data;
  }

  private getJobDetails() {
    this.jobService.getJob(this.jobId)
    .subscribe(
        (data: Job) => {
          this.job = data;
          this.isSendOfferHidden = this.isJobArchived() || this.isJobActive();
        },
        () => {
          this.isJobIdValid = false;
        });
  }

  private getUserId(): void {
    this.authService.getUser()
    .subscribe(
        (data) => {
          this.userId = data.id;
        },
        () => {
          this.messagesService.showError('common.message_error');
        }
    );
  }

  private openOfferSentModal() {
    const dialog = this.dialog.open(OfferSentModalComponent, {
      panelClass: 'offer-sent-modal',
      data: {
        firstName: this.profilePreview.firstName,
        lastName: this.profilePreview.lastName,
        id: this.profileId
      }
    });

    dialog.afterClosed().subscribe(
        () => {
          this.router.navigate([`profile/${this.profileId}`], {queryParams: {jobId: this.jobId}, replaceUrl: true});
        }
    );
  }

  private sendOffer(stripeToken: string, fullCharge: boolean): void {
    this.isRequestInProgress = true;

    this.jobService.sendOffer(this.jobId, this.profileId, stripeToken, fullCharge)
    .finally(
        () => this.isRequestInProgress = false
    )
    .subscribe(
        () => {
          this.job.status = this.jobStatusEnum.WAITING_FOR_RESPONSE;
          this.isOfferAlreadySent = true;
          this.openOfferSentModal();
        },
        () => {
          this.messagesService.showError('send_offer.payment_failed');
        }
    );
  }

  private sendOfferGoCardless(): void {
    this.jobService.sendGocardlessOffer(this.jobId, this.profileId, location.href).subscribe(
        (res) => {
          if (this.isMobile === false) {
            window.location.href = res.redirectURL;
          } else {
            const link = res.redirectURL;

            const browserRef = this.inAppBrowser.create(link, '_blank', 'location=no');

            //            TODO
            browserRef.on('loadstart').subscribe(
                (event: InAppBrowserEvent) => {
                  if (event.url.startsWith('https://dev') ||
                      event.url.startsWith('https://app.shootzu') ||
                      event.url.startsWith('http://localhost')) {
                    browserRef.close();
                    const redirectCode = event.url.split('flow_id=')[1];
                    this.router.navigate(
                        [`/profile/${this.profileId}`], {queryParams: {jobId: this.jobId, redirect_flow_id: redirectCode}});
                  }
                }
            );

          }
        },
        (error) => {
          console.log(error);
        }
    );
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

  private getApplicantUserId(): string {
    const applicant = (this.job.applicants || []).find((aApplicant) => aApplicant.profileId.toString() === this.profileId);

    return (typeof applicant === 'object') ? applicant.id.toString() : '';

    for (let i = 0; i < this.job.applicants.length; i++) {
      if (this.job.applicants[i].profileId === this.profileId.toString()) {
        return this.job.applicants[i].id.toString();
      }
    }
  }

  public goBackToApplicants(): void {
    if (typeof this.jobId !== 'undefined') {
      this.router.navigate([`/job/${this.jobId}/view`], {queryParams: {applicants: true, fromProfile: true}});
    } else {
      this.location.back();
    }
  }

  public getFullUserName(): string {
    if (this.profilePreview) {
      const {firstName, lastName} = this.profilePreview;

      return firstName ? `${firstName} ${lastName}` : '';
    }

    return '';
  }

  public openDialogHandler(): void {
    this.localStorageService.delete('offerTransactionComplete');
    this.openDialog();
  }

  private openDialog(): void {

    if (this.isOfferAlreadySent === true) {
      this.messagesService.showInfo('send_offer.offer_already_sent');
      return;
    }

    const dialogRef = this.dialog.open(SendOfferModalComponent, {
      panelClass: 'send-offer-modal',
      data: {
        name: this.getFullUserName(),
        jobDetails: this.job,
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((data) => {
          if (typeof data !== 'undefined') {
            if (data.methodType === 'stripe' || data.isStripeOnly === true) {
              this.sendOffer(data.token, data.isStripeOnly);
            } else if (data.methodType === 'gocardless') {
              this.sendOfferGoCardless();
            }
          }
        }
    );
  }

  public checkProfileId(): boolean {
    if (typeof this.job === 'undefined') {
      return;
    }

    return this.job.applicants.some((applicant: JobApplicants) => applicant.profileId.toString() === this.profileId);
  }

  public openSendMessageDialog(): void {
    const dialogRef = this.dialog.open(SendMessageModalComponent, {
      panelClass: 'send-message-modal',
      data: {
        recipientName: this.getFullUserName()
      }
    });

    //    TODO Refactor
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data.result === true) {
        this.messageToSend = new ChatNewMessage(this.jobId, this.getApplicantUserId(), this.userId, data.message);
        this.sendMessage();
      }
    });
  }

  public getBackButtonText(): string {
    if (typeof this.jobId !== 'undefined') {
      return 'Back to Applicants';
    } else {
      return 'Back to Job';
    }
  }

  public isAskAQuestionVisible(): boolean {
    if (typeof this.jobId === 'undefined') {
      return false;
    } else {
      return true;
    }
  }

  private isJobArchived(): boolean {
    if (typeof this.job !== 'undefined') {
      return this.job.status === this.jobStatusEnum.CANCELLED ||
             this.job.status === this.jobStatusEnum.COMPLETED ||
             this.job.status === this.jobStatusEnum.DONE;
    } else {
      return true;
    }
  }

  private isJobActive(): boolean {
    if (typeof this.job !== 'undefined') {
      return this.job.status === this.jobStatusEnum.OFFER_ACCEPTED ||
             this.job.status === this.jobStatusEnum.IN_PROGRESS;
    } else {
      return true;
    }
  }

  public goBack(): void {
    if (this.route.snapshot.queryParams['fromModal']) {
      this.router.navigate([`/job/${this.route.snapshot.queryParams['fromModal']}/view`]);
    } else {
      this.location.back();
    }
  }
}
