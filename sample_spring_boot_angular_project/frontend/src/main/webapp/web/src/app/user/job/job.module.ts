import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUserModule } from '../shared-user/shared-user.module';
import { JobRoutingModule } from './job-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobsComponent } from './jobs/jobs.component';
import { JobViewComponent } from './job-view/job-view.component';
import { JobSummaryComponent } from './job-summary/job-summary.component';
import { JobSummaryDateComponent } from './job-summary/job-summary-date/job-summary-date.component';
import { JobSummaryDescriptionComponent } from './job-summary/job-summary-description/job-summary-description.component';
import { JobSummaryHeaderComponent } from './job-summary/job-summary-header/job-summary-header.component';
import { JobSummaryFooterComponent } from './job-summary/job-summary-footer/job-summary-footer.component';
import { FindJobComponent } from './find-job/find-job.component';
import { CancelApplicationModalComponent } from './job-view/cancel-application-modal/cancel-application-modal.component';
import { JobFiltersComponent } from './find-job/job-filters/job-filters.component';
import { JobSortComponent } from './find-job/job-sort/job-sort.component';
import { SortIconsComponent } from './find-job/job-sort/sort-icons/sort-icons.component';
import { AcceptOfferModalComponent } from './job-view/accept-offer-modal/accept-offer-modal.component';
import { DeclineOfferModalComponent } from './job-view/decline-offer-modal/decline-offer-modal.component';
import { CompleteJobModalComponent } from './job-summary/job-summary-footer/complete-job-modal/complete-job-modal.component';

import { BarRatingModule } from 'ngx-bar-rating';
import { RenewJobModalComponent } from './job-view/renew-job-modal/renew-job-modal.component';
import { CancelJobModalComponent } from './job-view/cancel-job-modal/cancel-job-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialComponents,
    JobRoutingModule,
    SharedModule,
    SharedUserModule,
    FormsModule,
    ReactiveFormsModule,
    BarRatingModule,
  ],
  declarations: [
    JobsComponent,
    JobViewComponent,
    JobSummaryComponent,
    JobSummaryDateComponent,
    JobSummaryDescriptionComponent,
    JobSummaryHeaderComponent,
    JobSummaryFooterComponent,
    FindJobComponent,
    CancelApplicationModalComponent,
    JobFiltersComponent,
    JobSortComponent,
    SortIconsComponent,
    AcceptOfferModalComponent,
    DeclineOfferModalComponent,
    CompleteJobModalComponent,
    RenewJobModalComponent,
    CancelJobModalComponent
  ],
  exports: [
    JobsComponent,
    JobViewComponent,
    FindJobComponent
  ],
  entryComponents: [
    CancelApplicationModalComponent,
    AcceptOfferModalComponent,
    DeclineOfferModalComponent,
    CompleteJobModalComponent,
    RenewJobModalComponent,
    CancelJobModalComponent
  ]
})
export class JobModule {
}
