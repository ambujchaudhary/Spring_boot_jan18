import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MaterialComponents } from '../../utils/zu-material-components.module';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DragNDropComponent } from './drag-n-drop/drag-n-drop.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { IntroHeaderComponent } from './intro-header/intro-header.component';

import { DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { EquipmentsComponent } from './equipments/equipments.component';
import { InputComponent } from './input/input.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFiles: 0,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialComponents,
    DropzoneModule,
    TextMaskModule
  ],
  declarations: [
    DragNDropComponent,
    FileUploadComponent,
    IntroHeaderComponent,
    EquipmentsComponent,
    DatepickerComponent,
    InputComponent,
  ],
  exports: [
    DragNDropComponent,
    FileUploadComponent,
    IntroHeaderComponent,
    EquipmentsComponent,
    DatepickerComponent,
    InputComponent,
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    }
  ],
})
export class SharedUserModule {
}
