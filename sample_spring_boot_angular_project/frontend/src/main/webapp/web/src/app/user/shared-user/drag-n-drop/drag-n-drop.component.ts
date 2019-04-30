import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { CallbackHandlerService } from '../../../utils/callback-handler.service';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { ValidationService } from '../../../utils/validation.service';
import { UploadedFile } from '../../user.model';
import { ToasterConfigService } from '../../../utils/toaster-config.service';

const DRAG_AND_DROP_CLASSES = {
  zone: 'drag-n-drop-zone',
  images: 'drag-n-drop-zone-images',
  hover: 'drag-n-drop-zone__hover',
  active: 'drag-n-drop-zone__active',
  previewsContainer: 'dropzone-previews-container',
};

@Component({
  selector: 'zu-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styleUrls: ['./drag-n-drop.component.scss'],
})
export class DragNDropComponent implements OnInit, OnDestroy {

  @Input() files: UploadedFile[];
  @Input() max: number;
  @Input() accepts: string;
  @Input() container = false;
  @Input() size = false;
  @Input() maxFileSize = 5;
  @Input() url: string;

  @Output() onAddFile: EventEmitter<any> = new EventEmitter();

  public config: DropzoneConfigInterface = {
    clickable: false,
    maxFiles: null,
    //    autoQueue: false,
    autoReset: 0,
    errorReset: 0,
    cancelReset: 0,
    parallelUploads: 20,
    previewsContainer: `.${DRAG_AND_DROP_CLASSES.previewsContainer}`,
    createImageThumbnails: false,
    headers: {
      Authorization: this.localStorageService.get('authToken')
    }
  };

  private dragAndDropClasses = DRAG_AND_DROP_CLASSES;

  constructor(
      private validationService: ValidationService,
      private toaster: ToasterConfigService,
      private callbackService: CallbackHandlerService,
      private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    // Change this to your upload POST address:
    this.config.url = this.url;

    this.config.acceptedFiles = this.accepts || '';
    this.config.maxFilesize = this.maxFileSize;
    this.config.maxFiles = this.max;

    this.initDragAndRropEvent();
  }

  ngOnDestroy() {
    this.destroyDragAndRropEvent();
  }

  /* Drag and Drop events */
  private initDragAndRropEvent() {
    window.addEventListener('dragover', this.windowDragoverHandler, false);
    window.addEventListener('dragleave', this.windowDragleaveHandler, false);
    window.addEventListener('drop', this.windowDropHandler, false);
  }

  private destroyDragAndRropEvent() {
    window.removeEventListener('dragover', this.windowDragoverHandler, false);
    window.removeEventListener('dragleave', this.windowDragleaveHandler, false);
    window.removeEventListener('drop', this.windowDropHandler, false);
  }

  dragoverDragenterZoneHandler() {
    const {images: imagesClass, hover: hoverClass, active: activeClass} = this.dragAndDropClasses;

    if (document.getElementById(imagesClass).classList.contains(hoverClass) === false) {
      document.getElementById(imagesClass).classList.add(hoverClass);
    }

    if (document.getElementById(imagesClass).classList.contains(activeClass) === false) {
      document.getElementById(imagesClass).classList.add(activeClass);
    }
  }

  dragleaveZoneHandler() {
    const DELAY = 5;
    const {images: imagesClass, hover: hoverClass, active: activeClass} = this.dragAndDropClasses;

    setTimeout(
        () => {
          if (document.getElementById(imagesClass).classList.contains(hoverClass) === true) {
            document.getElementById(imagesClass).classList.remove(hoverClass);
          }

          if (document.getElementById(imagesClass).classList.contains(activeClass) === true) {
            document.getElementById(imagesClass).classList.remove(activeClass);
          }

        },
        DELAY);
  }

  private windowDragoverHandler(e: DragEvent) {
    const {zone: zoneClass, hover: hoverClass} = DRAG_AND_DROP_CLASSES;

    const ev = e || event;
    ev.preventDefault();

    const dndElements: NodeList = document.querySelectorAll(`.${zoneClass}:not(.${hoverClass})`);
    Array.prototype.forEach.call(dndElements, (aDndElement) => aDndElement.classList.add(hoverClass));
  }

  private windowDropHandler(e: DragEvent) {
    const {zone: zoneClass, hover: hoverClass} = DRAG_AND_DROP_CLASSES;

    const ev = e || event;
    ev.preventDefault();

    const dndElements: NodeList = document.querySelectorAll(`.${zoneClass}.${hoverClass}`);
    Array.prototype.forEach.call(dndElements, (aDndElement) => aDndElement.classList.remove(hoverClass));
  }

  private windowDragleaveHandler(e: DragEvent) {
    const {zone: zoneClass, hover: hoverClass} = DRAG_AND_DROP_CLASSES;

    const ev = e || event as DragEvent;
    ev.preventDefault();

    if (ev.clientX === 0 && ev.clientY === 0) {
      const dndElements: NodeList = document.querySelectorAll(`.${zoneClass}.${hoverClass}`);
      Array.prototype.forEach.call(dndElements, (aDndElement) => aDndElement.classList.remove(hoverClass));
    }
  }

  public uploadErrorZoneHandler(event: any) {
    console.log('onUploadError:', 'event', event);

    const file = event[0];

    const index = this.files.findIndex(
        (item) => this.validationService.isStringNotEmpty(item.originalName) === false && item.isLoading === false);
    const targetImage: UploadedFile = this.getImageByIndex(index);

    targetImage.originalName = file.name;
    targetImage.isLoading = true;

    if (this.validationService.isAcceptedFileExtension(file.name, this.accepts) === false) {
      UploadedFile.addError(targetImage, `File extension should be one of ${this.accepts}`);
      this.toaster.error(targetImage.errorMessage);
      return false;
    }

    if (this.validationService.isFileSizeLessMb(file, this.maxFileSize) === false) {
      UploadedFile.addError(targetImage, `File size should be less than ${this.maxFileSize}Mb`);
      this.toaster.error(targetImage.errorMessage);
      return false;
    }

    if (file.status === 'error') {
      UploadedFile.addError(targetImage, event[1]);
      this.toaster.error(event[1]);
      return false;
    }
  }

  public processingZoneHandler(file: any) {
    console.log('onprocessing: event', file);

    let index = this.files.findIndex(
        (item) => this.validationService.isStringNotEmpty(item.originalName) === false && item.isLoading === false);

    if (index === -1 && this.max > 0 && this.files.length <= this.max) {

      //  file count validation
      if (typeof this.max === 'number' && this.files.length >= this.max) {
        this.toaster.error(`Can't upload more than ${this.max} files`);
        return;
      }

      this.onAddFile.emit();
      index = this.files.length;
    }

    const targetFile = this.getImageByIndex(index);

    targetFile.originalName = file.name;
    targetFile.isLoading = true;
  }

  public completeZoneHandler(event: any) {
    console.log('oncomplete: event', event);
    if (event.status === 'error' && event && event.xhr) {

      const index = (this.files || []).findIndex((item) => item.isLoading === true && item.originalName === event.name);
      const targetFile = this.getImageByIndex(index);

      const errorMessage = this.callbackService.getErrorMessage(event && event.xhr);

      UploadedFile.addError(targetFile, errorMessage);
      this.toaster.error(targetFile.errorMessage);
    }
  }

  public sendingZoneHandler(event: any) {
    console.log('onsending: event', event);
    return false;
  }

  public dropZoneHandler(event: any) {
    this.windowDropHandler(event);
    return false;
  }

  public uploadSuccessZoneHandler(event: any): void {
    const index = this.files.findIndex((item) => item.isLoading === true && item.originalName === event[0].name);
    const targetFile = this.getImageByIndex(index);

    targetFile.originalName = event[1].originalName;
    targetFile.url = event[1].url;
    targetFile.fullName = event[1].fullName;

    UploadedFile.setClientSideData(targetFile);
  }

  private getImageByIndex(index: number): UploadedFile {
    return this.files[index] || new UploadedFile();
  }

  /* End of Drag and Drop events */
}
