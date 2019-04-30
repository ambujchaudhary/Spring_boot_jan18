import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Platform } from '@ionic/angular';
import { User } from '../../../auth/auth.model';
import { MessagesService } from '../../../utils/messages.service';
import { SessionStorageService } from '../../../utils/storage/session-storage.service';
import { UserService } from '../../../user/user.service';

@Component({
  selector: 'zu-application-sent-modal',
  templateUrl: './application-sent-modal.component.html',
  styleUrls: ['./application-sent-modal.component.scss'],
})
export class ApplicationSentModalComponent implements OnInit {

  private platform: Platform;
  private user: User;
  private profileId: string;
  public jobId: string;

  constructor(
      private dialogRef: MatDialogRef<ApplicationSentModalComponent>,
      private injector: Injector,
      private sessionStorageService: SessionStorageService,
      private userService: UserService,
      private messagesService: MessagesService,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }

    if (typeof data !== 'undefined') {
      this.jobId = data;
    }
  }

  ngOnInit() {
    this.user = this.sessionStorageService.getObject<User>('user');
    this.getProfileId();
  }

  private getProfileId(): void {
    this.userService.getProfileId(this.user.id)
    .subscribe(
        (data) => {
          this.profileId = data.profileId;
        },
        () => {
          //          TODO uncomment
          //          this.messagesService.showError('common.message_error');
        }
    );
  }

  public isMobile(): boolean {
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

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public getProfileRedirectUrl(): string {
    if (this.profileId) {
      return `/profile/${this.profileId}`;
    } else {
      return `/profile`;
    }
  }
}
