import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BarRatingModule } from 'ngx-bar-rating';
import { SharedUserModule } from '../user/shared-user/shared-user.module';
import { AdminOnlyDirective } from './admin-only.directive';
import { EmptyChatComponent } from './chat/empty-chat/empty-chat.component';
import { EquipmentsPreviewComponent } from './equipments-preview/equipments-preview.component';

import { GoogleAutocompleteDirective } from './google-autocomplete/google-autocomplete.directive';
import { JobApplicantsComponent } from './job-preview/job-applicants/job-applicants.component';
import { JobPreviewComponent } from './job-preview/job-preview.component';
import { ApplicationSentModalComponent } from './job-view-controls/application-sent-modal/application-sent-modal.component';
import { BuyMembershipModalComponent } from './job-view-controls/buy-membership-modal/buy-membership-modal.component';
import { JobViewControlsComponent } from './job-view-controls/job-view-controls.component';
import { JobViewHeaderButtonsComponent } from './job-view-header-buttons/job-view-header-buttons.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { PhotoViewModalComponent } from './photo-gallery/photo-view-modal/photo-view-modal.component';
import { PostJobControlsComponent } from './post-job/post-job-controls/post-job-controls.component';
import { PostJobExplanationComponent } from './post-job/post-job-explanation/post-job-explanation.component';
import { PostJobComponent } from './post-job/post-job.component';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { SvgIconsComponent } from './svg-icons/svg-icons.component';
import { HeaderComponent } from './header/header.component';
import { UserOnlyDirective } from './user-only.directive';
import { TooltipComponent } from './tooltip/tooltip.component';
import { MaterialComponents } from '../utils/zu-material-components.module';
import { SummaryComponent } from './summary/summary.component';
import { AccordionComponent } from './accordion/accordion.component';
import { AttachmentsPreviewComponent } from './attachments-preview/attachments-preview.component';
import { TextareaComponent } from './textarea/textarea.component';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ZuDatePipe } from './zu-date.pipe';
import { TooltipGroupComponent } from './tooltip-group/tooltip-group.component';
import { RoleIconsComponent } from './role-icons/role-icons.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { RatingPickerComponent } from './rating-picker/rating-picker.component';
import { HeaderNotificationsComponent } from './header/header-notifications/header-notifications.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { HeaderMessagesComponent } from './header/header-messages/header-messages.component';
import { ChatComponent } from './chat/chat.component';
import { RouterDirectionDirective } from './router-direction.directive';
import { BrowserOnlyDirective } from './browser-only.directive';
import { ProfileFeedbackComponent} from './profile-feedback/profile-feedback.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialComponents,
    RouterModule,
    BarRatingModule,
    SharedUserModule,
    ReactiveFormsModule
  ],
  declarations: [
    GoogleAutocompleteDirective,
    SvgIconsComponent,
    HeaderComponent,
    AdminOnlyDirective,
    UserOnlyDirective,
    TooltipComponent,
    SummaryComponent,
    AccordionComponent,
    AttachmentsPreviewComponent,
    TextareaComponent,
    ModalDialogComponent,
    ZuDatePipe,
    TextareaComponent,
    TooltipGroupComponent,
    RoleIconsComponent,
    PhotoGalleryComponent,
    ProfileDetailsComponent,
    PhotoViewModalComponent,
    EquipmentsPreviewComponent,
    ProfileSummaryComponent,
    RatingPickerComponent,
    HeaderNotificationsComponent,
    AlertMessageComponent,
    HeaderMessagesComponent,
    ChatComponent,
    EmptyChatComponent,
    RouterDirectionDirective,
    BrowserOnlyDirective,
    ProfileFeedbackComponent,
    JobViewHeaderButtonsComponent,
    JobViewControlsComponent,
    ApplicationSentModalComponent,
    BuyMembershipModalComponent,
    JobPreviewComponent,
    JobApplicantsComponent,
    PostJobComponent,
    PostJobControlsComponent,
    PostJobExplanationComponent
  ],
  exports: [
    GoogleAutocompleteDirective,
    SvgIconsComponent,
    HeaderComponent,
    AdminOnlyDirective,
    TooltipComponent,
    SummaryComponent,
    AttachmentsPreviewComponent,
    AccordionComponent,
    TextareaComponent,
    ModalDialogComponent,
    ZuDatePipe,
    TextareaComponent,
    TooltipGroupComponent,
    RoleIconsComponent,
    PhotoGalleryComponent,
    ProfileDetailsComponent,
    PhotoViewModalComponent,
    EquipmentsPreviewComponent,
    ProfileSummaryComponent,
    RatingPickerComponent,
    AlertMessageComponent,
    HeaderMessagesComponent,
    ChatComponent,
    EmptyChatComponent,
    RouterDirectionDirective,
    ProfileFeedbackComponent,
    JobViewHeaderButtonsComponent,
    JobViewControlsComponent,
    ApplicationSentModalComponent,
    BuyMembershipModalComponent,
    JobPreviewComponent,
    JobApplicantsComponent,
    PostJobComponent
  ],
  entryComponents: [
    PhotoViewModalComponent,
    ApplicationSentModalComponent,
    BuyMembershipModalComponent
  ]
})
export class SharedModule {
}
