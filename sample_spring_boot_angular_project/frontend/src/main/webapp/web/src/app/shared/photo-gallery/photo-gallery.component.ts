import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadedFile } from '../../user/user.model';
import { GalleryPhoto } from './photo-gallery.model';
import { PhotoViewModalComponent } from './photo-view-modal/photo-view-modal.component';

@Component({
  selector: 'zu-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit, OnChanges {

  @Input() photos: UploadedFile[];

  public galleryPhotos: GalleryPhoto[];
  public isGalleriaOpen = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.updateGalleryItems();
  }

  ngOnChanges() {
    this.updateGalleryItems();
  }

  public toggleGallery() {
    this.isGalleriaOpen = !this.isGalleriaOpen;
    this.updateGalleryItems();
  }

  private updateGalleryItems() {
    const minGalleriaItems = 5;
    const tmpPhotos = this.photos || [];

    const tmpGalleryPhotos = this.isGalleriaOpen ? tmpPhotos.slice() : tmpPhotos.slice(0, minGalleriaItems);
    this.galleryPhotos = tmpGalleryPhotos.map((uploadedImage) => new GalleryPhoto(uploadedImage.url, uploadedImage.size200));
  }

  public openDialog(index: number): void {
    const selectedPhoto = this.galleryPhotos[index];
    const isHorizontalImage = selectedPhoto.width >= selectedPhoto.height;

    const photoDirectionClass = isHorizontalImage ? 'photo-block--horizontal' : 'photo-block--vertical';

    this.dialog.open(PhotoViewModalComponent, {
      panelClass: ['photo-block', photoDirectionClass],
      data: {photo: selectedPhoto},
    });
  }

  public setBackgroundImage(photo: GalleryPhoto): Object {
    const stylesObject = {};

    if (photo && photo.size200) {
      stylesObject['background-image'] = `url("${photo.size200}")`;
    }

    return stylesObject;
  }

  public onGalleryImageUploadHandler(index: number, event: any): void {
    const photo = this.galleryPhotos[index];

    photo.width = event.width;
    photo.height = event.height;
  }
}
