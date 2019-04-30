import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../../shared/modal-dialog/modal-dialog.component';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { MessagesService } from '../../../utils/messages.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { ValidationService } from '../../../utils/validation.service';
import { ChangePasswordData, ChangePasswordTextVisibilityEnum } from '../../user.model';
import { UserService } from '../../user.service';

@Component({
  selector: 'zu-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})

export class ChangePasswordModalComponent implements OnInit {

  private readonly minPasswordLength = 6;
  public readonly maxPasswordLength = 32;
  public readonly ChangePasswordTextVisibilityEnum = ChangePasswordTextVisibilityEnum;

  public isRequestInProgress = false;
  public changePassData: ChangePasswordData;

  public visible = {
    old: false,
    new: false,
    confirm: false,
  };

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              private validationService: ValidationService,
              private userService: UserService,
              private toaster: ToasterConfigService,
              private callbackService: CallbackHandlerService,
              private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.changePassData = new ChangePasswordData();
  }

  private validationBeforeSend(): boolean {
    let result = false;

    if (this.validationService.isSomeStringEmpty(
        this.changePassData.confirmPassword,
        this.changePassData.newPassword,
        this.changePassData.oldPassword) === true) {
      this.messagesService.showError('common.all_fields_are_mandatory');
    } else if (this.changePassData.newPassword !== this.changePassData.confirmPassword) {
      this.messagesService.showError('register.password_not_match');
    } else if (this.changePassData.newPassword.length < this.minPasswordLength) {
      this.messagesService.showError('register.password_short');
    } else {
      result = true;
    }

    return result;
  }

  public changePassword(): void {
    if (this.validationBeforeSend() === false) {
      return;
    }

    this.isRequestInProgress = true;

    this.userService.changePassword(this.changePassData)
    .finally(
        () => {
          this.isRequestInProgress = false;
        }
    )
    .subscribe(
        () => {
          this.messagesService.showSuccess('change_password.message_success');
          this.dialogRef.close();
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
        }
    );
  }

  public showPassword(key: ChangePasswordTextVisibilityEnum): void {
    this.visible[key] = !this.visible[key];
  }

  public setOldPassVisibility(): string {
    if (this.visible.old === true) {
      return 'visible';
    }
  }

  public setNewPassVisibility(): string {
    if (this.visible.new === true) {
      return 'visible';
    }
  }

  public setConfirmPassVisibility(): string {
    if (this.visible.confirm === true) {
      return 'visible';
    }
  }
}
