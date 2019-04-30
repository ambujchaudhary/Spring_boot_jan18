import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarRatingModule } from 'ngx-bar-rating';

import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { StatisticsComponent } from './statistics/statistics.component';

import { SliderComponent } from './slider/slider.component';
import { PodcastSlideComponent } from './slider/podcast-slide/podcast-slide.component';
import { AppSlideComponent } from './slider/app-slide/app-slide.component';
import { ShooterFeedbackModalComponent } from './shooter-feedback-modal/shooter-feedback-modal.component';
import { PreExpireJobModalComponent } from './pre-expire-job-modal/pre-expire-job-modal.component';
import { AutocompleteJobModalComponent } from './autocomplete-job-modal/autocomplete-job-modal.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    MaterialComponents,
    SharedModule,
    BarRatingModule
  ],
  declarations: [
    DashboardComponent,
    WeatherForecastComponent,
    StatisticsComponent,
    SliderComponent,
    PodcastSlideComponent,
    AppSlideComponent,
    ShooterFeedbackModalComponent,
    PreExpireJobModalComponent,
    AutocompleteJobModalComponent,
  ],
  exports: [
      DashboardComponent
  ],
  providers: [],
  entryComponents: [
    ShooterFeedbackModalComponent,
    PreExpireJobModalComponent,
    AutocompleteJobModalComponent
  ]
})
export class DashboardModule {
}
