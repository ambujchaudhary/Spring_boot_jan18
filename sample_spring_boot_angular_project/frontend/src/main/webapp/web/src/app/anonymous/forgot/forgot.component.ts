import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AnonymousService } from '../anonymous.service';
import { ForgetPasswordFormData } from '../anonymous.model';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { MessagesService } from '../../utils/messages.service';

const EMAIL_REGEX = /\S+@\S+\.\S+/;

@Component({
  selector: 'zu-forgot',
  templateUrl: 'forgot.component.html',
  styleUrls: ['forgot.component.scss'],
})
export class ForgotComponent implements OnInit {

  forgotPasswordForm: any;
  isRequestInProgress: boolean;

  // Check email for empty
  private static isAllFieldFill(forgetPassData: ForgetPasswordFormData): boolean {
    const {
      email = '',
    } = forgetPassData;

    return email !== '' && email.trim() !== '';
  }

  constructor(private anonymousService: AnonymousService,
              private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private messagesService: MessagesService,
              private router: Router
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
    });
  }

  // Send recovery password email
  sendRestorationEmail() {

    // Check for empty field
    if (ForgotComponent.isAllFieldFill(this.forgotPasswordForm.value) === false) {
      this.messagesService.showError('forgot.email_is_required.message_error');
      return;
    } else if (this.forgotPasswordForm.get('email').hasError('pattern')) {
      this.messagesService.showError('forgot.email_is_not_valid.message_error');
      return;
    }

    const forgetPasswordRequestParam: ForgetPasswordFormData = this.forgotPasswordForm.value;

    this.isRequestInProgress = true;

    this.anonymousService.sendMailRestorePassword(forgetPasswordRequestParam)
    .subscribe(
        (forgetPasswordData) => {
          this.messagesService.showSuccess('forgot.have_sent_email.message_success');
          // Redirecting to login after success sent email
          Observable.timer(2000)
            .subscribe(() => {
              this.router.navigate(['/login']);
            });
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
          this.isRequestInProgress = false;
        }
    );
  }
}
