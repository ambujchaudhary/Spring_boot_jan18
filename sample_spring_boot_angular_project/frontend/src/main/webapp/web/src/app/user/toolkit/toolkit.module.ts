import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { SharedModule } from '../../shared/shared.module';
import { ToolkitComponent } from './toolkit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialComponents,
    RouterModule
  ],
  declarations: [
    ToolkitComponent
  ],
  exports: [
    ToolkitComponent
  ],
})
export class ToolkitModule {
}
