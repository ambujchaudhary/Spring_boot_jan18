import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../../shared/shared.module';
import { BusinessProfileComponent } from './business-profile.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedUserModule } from '../shared-user/shared-user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TextMaskModule,
    MaterialComponents,
    ReactiveFormsModule,
    RouterModule,
    SharedUserModule
  ],
  declarations: [
    BusinessProfileComponent
  ],
  exports: [
    BusinessProfileComponent
  ],
})
export class BusinessProfileModule {
}
