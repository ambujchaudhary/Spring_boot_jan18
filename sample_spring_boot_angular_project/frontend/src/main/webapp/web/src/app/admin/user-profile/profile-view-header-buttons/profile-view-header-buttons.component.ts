import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessagesService } from '../../../utils/messages.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { PrivateUserProfileData } from '../../admin.model';
import { AdminService } from '../../admin.service';
import { BlockUserModalComponent } from './block-user-modal/block-user-modal.component';
import { UnblockUserModalComponent } from './unblock-user-modal/unblock-user-modal.component';

@Component({
  selector: 'zu-profile-view-header-buttons',
  templateUrl: './profile-view-header-buttons.component.html',
  styleUrls: ['./profile-view-header-buttons.component.scss']
})
export class ProfileViewHeaderButtonsComponent implements OnInit {
  @Input() user: PrivateUserProfileData;
  @Input() userId: string;

  public tooltipPosition = 'below';
  public editTooltipMessage = 'Edit profile';
  public isRequestInProgress = false;

  constructor(private dialog: MatDialog,
              private adminService: AdminService,
              private toaster: ToasterConfigService,
              private messagesService: MessagesService) { }

  ngOnInit() {}

  public blockUser(): void {
    if (typeof this.user !== 'undefined' && this.user.blocked === false) {

      const dialogRef = this.dialog.open(BlockUserModalComponent);

      dialogRef.afterClosed().subscribe((data: boolean) => {
        if (data === true) {
          this.isRequestInProgress = true;

          this.adminService.blockUser(this.userId)
          .finally(() => {
            this.isRequestInProgress = false;
          })
          .subscribe(
              () => {
                this.messagesService.showSuccess('profile.user_blocked.message_success');
                this.user.blocked = true;
              },
              () => {
                this.messagesService.showError('profile.user_block.message_error');
              }
          );
        }
      });
    }
  }

  public unblockUser(): void {
    if (typeof this.user !== 'undefined' && this.user.blocked === true) {

      const dialogRef = this.dialog.open(UnblockUserModalComponent);

      dialogRef.afterClosed().subscribe((data: boolean) => {
        if (data === true) {
          this.isRequestInProgress = true;

          this.adminService.unblockUser(this.userId)
          .finally(() => {
            this.isRequestInProgress = false;
          })
          .subscribe(
              () => {
                this.messagesService.showSuccess('profile.user_unblocked.message_success');
                this.user.blocked = false;
              },
              () => {
                this.messagesService.showError('profile.user_unblocked.message_error');
              }
          );
        }
      });
    }
  }

  public getLinkForEditProfile(): string {
    return `/admin/user-profile/${this.userId}/edit`;
  }
}
