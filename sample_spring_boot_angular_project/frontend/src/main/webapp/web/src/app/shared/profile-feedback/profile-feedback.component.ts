import { Component, Input } from '@angular/core';
import { OwnerNameEnum } from '../../user/job/job.model';
import { FeedbackConfig, FeedbackData } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { unionBy } from 'lodash/array';

@Component({
  selector: 'zu-profile-feedback',
  templateUrl: './profile-feedback.component.html',
  styleUrls: ['./profile-feedback.component.scss']
})

export class ProfileFeedbackComponent {
  @Input() profileId: number;
  @Input() feedbackQuantity: number;

  public readonly ownerNameEnum = OwnerNameEnum;
  public feedback: FeedbackData[];
  public page: number;
  public size: number;

  public isUploadInProgress = false;
  public isLastPage: boolean;
  public isFeedbacksOpen = false;

  constructor(private userService: UserService) {
    this.feedback = [];
    this.page = FeedbackConfig.page;
    this.size = FeedbackConfig.size;
  }

  private uploadFeedback(): void {
    const options = {page: this.page, size: this.size};

    this.isUploadInProgress = true;

    this.userService.getUserFeedback(options, this.profileId)
    .finally(() => this.isUploadInProgress = false)
    .subscribe((data) => {
      this.processNewFeedback(data);
    });
  }

  private processNewFeedback(data: FeedbackData[]): void {
    this.feedback = unionBy(this.feedback, data, 'id');

    if (data.length < this.size) {
      this.isLastPage = true;
    } else {
      this.page += 1;
    }
  }

  public uploadMoreFeedback(): void {
    if (this.isLastPage !== true) {
      this.uploadFeedback();
    }
  }

  public openFeedbacks(): void {
    if (this.feedback.length === 0) {
      this.uploadFeedback();
      this.isLastPage = this.feedbackQuantity === this.size ? true : false;
    }

    this.isFeedbacksOpen = !this.isFeedbacksOpen;
  }
}
