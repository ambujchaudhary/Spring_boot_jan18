import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { zip } from 'rxjs/internal/observable/zip';
import { Subject } from 'rxjs/Subject';
import { PreExpireJobData } from '../../user/job/job.model';
import { JobService } from '../../user/job/job.service';
import { JobDataForFeedback, LoginModalsData } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { MessagesService } from '../../utils/messages.service';
import { LocalStorageService } from '../../utils/storage/local-storage.service';
import { ValidationService } from '../../utils/validation.service';

import { AnonymousService } from '../anonymous.service';
import { AuthService } from '../../auth/auth.service';
import { LoginCredential } from '../anonymous.model';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { AccountBlockedModalComponent } from './account-blocked-modal/account-blocked-modal.component';

export const EMAIL_REGEX = /\S+@\S+\.\S+/;

@Component({
  selector: 'zu-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {

  @Input() mobile = false;

  public isMobile: boolean;
  private platform: Platform;

  public loginForm: LoginCredential;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
      private router: Router,
      private authService: AuthService,
      private anonymousService: AnonymousService,
      private toaster: ToasterConfigService,
      private messagesService: MessagesService,
      private validationService: ValidationService,
      private callbackService: CallbackHandlerService,
      private userService: UserService,
      private jobService: JobService,
      private localStorageService: LocalStorageService,
      private dialog: MatDialog,
      private route: ActivatedRoute,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }
  }

  ngOnInit() {

    this.localStorageService.delete('authToken');

    this.isMobile = this.mobile === true;

    console.log('this.mobile', this.mobile);
    console.log('this.isMobile', this.isMobile);

    this.loginForm = new LoginCredential('', '');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private validation(): boolean {
    this.toaster.hide();

    let result = false;

    if (this.validationService.isStringNotEmpty(this.loginForm.email) === false) {
      this.messagesService.showError('login.email.empty');
    } else if (this.validationService.isStringNotEmpty(this.loginForm.password) === false) {
      this.messagesService.showError('login.password.empty');
    } else if (!(EMAIL_REGEX.test(this.loginForm.email))) {
      this.messagesService.showError('common.email_is_invalid');
    } else {
      result = true;
    }

    return result;
  }

  public login(): void {
    if (this.validation() !== true) {
      return;
    }

    this.anonymousService.login(this.loginForm).subscribe(
        (data) => {

          console.log('token', data.token);

          this.localStorageService.set('authToken', data.token);

          // Login modal windows date getting below
          const getShooterFeedbackNeeded$ = this.userService.getJobsForShooterFeedback();
          const getPreExpireJobs$ = this.jobService.getPreExpireJobs();
          const getBusinessFeedbackNeeded$ = this.userService.getAutocompleteJobs();

          zip(getShooterFeedbackNeeded$, getPreExpireJobs$, getBusinessFeedbackNeeded$)
          .subscribe((response: LoginModalsData) => {
            if (typeof response !== 'undefined') {
              const [feedbackJobs, expiringJobs, autocompleteJobs] = response;

              if (feedbackJobs.length > 0) {
                this.localStorageService.setObject<JobDataForFeedback[]>('feedbackModalData', feedbackJobs);
              }

              if (expiringJobs.length > 0) {
                this.localStorageService.setObject<PreExpireJobData[]>('preExpireJobModalData', expiringJobs);
              }

              if (autocompleteJobs.length > 0) {
                this.localStorageService.setObject<JobDataForFeedback[]>('autocompleteModalData', autocompleteJobs);
              }

              if (feedbackJobs.length > 0 || expiringJobs.length > 0 || autocompleteJobs.length > 0) {
                this.router.navigate(['/dashboard']);
              }
            }

            this.router.navigate(['/']);
          });

        },
        (error) => {
          let isBlocked = false;

          console.log('error', error);
          if (error.error.message === 'User is disabled') {
            isBlocked = true;
            this.dialog.open(AccountBlockedModalComponent);
          }

          if (isBlocked) {
            return;
          }

          const errorMessage = this.callbackService.getErrorMessage(error);
          this.toaster.error(errorMessage);
        });
  }
}
