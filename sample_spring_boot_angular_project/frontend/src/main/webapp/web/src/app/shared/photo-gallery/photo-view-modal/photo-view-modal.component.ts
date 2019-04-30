import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../modal-dialog/modal-dialog.component';
import { GalleryPhoto } from '../photo-gallery.model';

@Component({
  selector: 'zu-photo-view-modal',
  templateUrl: './photo-view-modal.component.html',
  styleUrls: ['./photo-view-modal.component.scss']
})
export class PhotoViewModalComponent {

  public photo: GalleryPhoto;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {

    if (data) {
      this.photo = data.photo;
    }
  }

  public setBackgroundImage(): Object {
    const stylesObject = {};

    if (this.photo && this.photo.size200) {
      stylesObject['background-image'] = `url("${this.photo.size200}")`;
    }

    return stylesObject;
  }

  public closeModal() {
    this.dialogRef.close(true);
  }
}
