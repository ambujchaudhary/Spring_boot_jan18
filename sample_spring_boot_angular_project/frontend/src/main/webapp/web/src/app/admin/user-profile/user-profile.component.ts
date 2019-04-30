import { Component, OnInit } from '@angular/core';
import { UserStatus } from '../../auth/auth.model';
import { UserService } from '../../user/user.service';
import { MessagesService } from '../../utils/messages.service';
import { AdminService } from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { Observable } from 'rxjs/Rx';
import { CallbackHandlerService } from '../../utils/callback-handler.service';

import { AdminDeclineFeedbackData, PrivateUserProfileData } from '../admin.model';

@Component({
  selector: 'zu-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  adminCommentForm: any;

  constructor(
      private adminService: AdminService,
      protected route: ActivatedRoute,
      private toaster: ToasterConfigService,
      private router: Router,
      private callbackService: CallbackHandlerService,
      private messagesService: MessagesService,
      private userService: UserService
  ) { }

  public userProfileData: PrivateUserProfileData;
  public profileId: string;
  public userId: number = this.route.snapshot.params['id'];

  public isCommentFieldVisible = false;
  public isRequestInProgress = false;

  public readonly userStatus = UserStatus;

  ngOnInit() {
    this.getUserProfileData(this.userId);
    this.initAdminForm();
    this.getProfileId();
  }

  private getUserProfileData(userId): void {
    this.adminService.getUserProfileData(userId).subscribe((data: PrivateUserProfileData) => {
      this.userProfileData = data;
    });
  }

  private initAdminForm(): void {
    this.adminCommentForm = new FormGroup({
      comment: new FormControl('', Validators.required),
      id: new FormControl(this.userId),
    });
  }

  private getProfileId(): void {
    this.userService.getProfileId(this.userId.toString())
    .subscribe(
        (data) => {
          this.profileId = data.profileId;
        },
        () => {
          this.userProfileData.feedbackQuantity = 0;
        }
    );
  }

  public showCommentField(): void {
    this.isCommentFieldVisible = true;
  }

  public sendDeclineFeedback() {
    // Validation
    if (this.adminCommentForm.get('comment').hasError('required')) {
      this.messagesService.showError('admin.user_profile.feedback.message_error');
      return;
    }

    // TODO add min comment length validation

    const adminFeedbackRequestParam: AdminDeclineFeedbackData = this.adminCommentForm.value;
    this.isRequestInProgress = true;

    this.adminService.sendAdminDeclineFeedback(adminFeedbackRequestParam).subscribe(
        () => {
          this.messagesService.showSuccess('admin.user_profile.profile_is_declined.message_success');
          this.isCommentFieldVisible = false;

          // Redirecting after decline
          Observable.timer(5000)
          .subscribe(() => {
            this.router.navigate(['/admin/dashboard']);
          });
        },
        (error) => {
          this.callbackService.getErrorMessage(error);
          this.isRequestInProgress = false;
        });
  }

  public approveProfile(): void {
    this.isRequestInProgress = true;
    this.isCommentFieldVisible = false;

    this.adminService.approveUserProfile(this.userId).subscribe(
        () => {
          this.messagesService.showSuccess('admin.user_profile.profile_is_approved.message_success');

          // Redirecting after decline
          Observable.timer(3000)
          .subscribe(() => {
            this.router.navigate(['/admin/dashboard']);
          });
        },
        (error) => {
          this.toaster.error(this.callbackService.getErrorMessage(error));
          this.isRequestInProgress = false;
        });
  }
}
