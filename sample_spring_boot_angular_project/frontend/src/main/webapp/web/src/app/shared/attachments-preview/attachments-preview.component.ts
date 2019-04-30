import { Component, Input } from '@angular/core';
import { UploadedFile } from '../../user/user.model';

@Component({
  selector: 'zu-attachments-preview',
  templateUrl: './attachments-preview.component.html',
  styleUrls: ['./attachments-preview.component.scss'],
})
export class AttachmentsPreviewComponent {

  @Input() files: UploadedFile[] | string = [];
  @Input() isUploadedFile = false;

  constructor() { }
}
