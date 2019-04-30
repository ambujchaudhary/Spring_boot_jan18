import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { MessagesService } from '../../utils/messages.service';

import { AnonymousService } from '../anonymous.service';
import { ChangePasswordFormData } from '../anonymous.model';
import { CallbackHandlerService } from '../../utils/callback-handler.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';

@Component({
  selector: 'zu-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: any;

  isRequestInProgress: boolean;
  token: string;

  // Check fields for empty
  private static isAllFieldFill(changePassData: ChangePasswordFormData): boolean {
    const {
      password = '',
      confirmPassword = '',
    } = changePassData;

    return password !== '' &&
           confirmPassword !== '';
  }

  // Check password for minimum required length
  private static isPasswordShort(passwordValue = ''): boolean {
    const minPasswordLength = 6;

    return passwordValue.length >= minPasswordLength;
  }

  // Check passwords identity
  private static isPasswordSame(password = '', confirmPassword = ''): boolean {
    return password === confirmPassword;
  }

  constructor(private anonymousService: AnonymousService,
              private route: ActivatedRoute,
              private router: Router,
              private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private messagesService: MessagesService) {
    this.route.params.subscribe((params) => this.token = params['token']);
  }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      token: new FormControl(this.token),
    });
  }

  // Change password to new
  changePassword() {

    // Check for empty fields
    if (ChangePasswordComponent.isAllFieldFill(this.changePasswordForm.value) === false) {
      this.messagesService.showError('common.all_fields_are_mandatory');
      return;
    } else if (ChangePasswordComponent.isPasswordShort(this.changePasswordForm.value.password) === false) {
      this.messagesService.showError('register.password_short');
      return;
    } else if (ChangePasswordComponent.isPasswordSame(this.changePasswordForm.value.password,
        this.changePasswordForm.value.confirmPassword) === false) {
      this.messagesService.showError('register.password_not_match');
      return;
    }

    const changePasswordRequestParam: ChangePasswordFormData = this.changePasswordForm.value;

    this.anonymousService.changePassword(changePasswordRequestParam)
    .subscribe(
        (changePasswordData) => {
          this.messagesService.showSuccess('register.change_password.message_success');
          this.isRequestInProgress = true;

          // Redirecting to login after success password change
          Observable.timer(2000)
          .subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        (error) => {
          this.messagesService.showError(error.error.message);
          this.isRequestInProgress = false;
        }
    );
  }
}
