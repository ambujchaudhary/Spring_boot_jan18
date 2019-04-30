import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToasterConfigService } from '../../../utils/toaster-config.service';

import { UploadedFile } from '../../user.model';

/*
* Example:
*
* <zu-file-upload
*     [data]="uploadedImage"
*     [index]="index"
*     [labelType]="'photo'"
*     [label]="'+ Add photo'"
*     [accepts]="'.jpg,.jpeg'"
*     (onChangeHandler)="uploadImage($event, index)"
*     (onDeleteImageHandler)="deleteImage(index)">
* </zu-file-upload>
*
* */

@Component({
  selector: 'zu-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {

  @Input() data: UploadedFile;
  @Input() index: number;
  @Input() accepts = '';
  @Input() label = '+ add file';
  @Input() labelType = '';

  @Output() onChangeHandler = new EventEmitter<{target: HTMLInputElement}>();
  @Output() onDeleteImageHandler = new EventEmitter();

  private platform: Platform;
  private camera: Camera;

  constructor(
      private toaster: ToasterConfigService,
      private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }

    try {
      this.camera = injector.get(Camera);
    } catch (e) {
    }
  }

  ngOnInit() {

  }

  public getAccepts(): string {
    try {
      if (this.platform.is('ios')) {
        //      return this.accepts || '';
        return 'image/*';
      } else if (this.platform.is('android')) {
        //      return '*/*';
        return '';
      } else {
        return this.accepts || '';
      }
    } catch (e) {
      return this.accepts || '';
    }

  }

  public onChange($event: {target: HTMLInputElement}) {
    this.onChangeHandler.emit($event);
  }

  public onDeleteImage() {
    this.onDeleteImageHandler.emit();
  }

}
