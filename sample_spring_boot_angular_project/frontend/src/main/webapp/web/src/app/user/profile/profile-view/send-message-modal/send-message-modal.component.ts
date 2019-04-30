import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalDialogComponent } from '../../../../shared/modal-dialog/modal-dialog.component';
import { MessagesService } from '../../../../utils/messages.service';
import { ToasterConfigService } from '../../../../utils/toaster-config.service';
import { ValidationService } from '../../../../utils/validation.service';
import { JobService } from '../../../job/job.service';

@Component({
  selector: 'zu-send-message-modal',
  templateUrl: './send-message-modal.component.html',
  styleUrls: ['./send-message-modal.component.scss']
})
export class SendMessageModalComponent implements OnInit {

  public message: string;
  public messageMaxLenght = 5000;
  public recipientName: string;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data,
              private jobService: JobService,
              private messagesService: MessagesService,
              private validationService: ValidationService,
              private toaster: ToasterConfigService) {

    if (data !== null) {
      this.recipientName = data.recipientName;
    }
  }

  ngOnInit() {
  }

  private validationBeforeSend(): boolean {
    let result = false;

    this.toaster.hide();

    if (this.validationService.isStringNotEmpty(this.message) === false) {
      this.messagesService.showError('send_message_modal.message_is_empty');
    } else {
      result = true;
    }

    return result;
  }

  public sendMessage(): void {
    if (this.validationBeforeSend() === false) {
      return;
    }

    this.dialogRef.close({
      result: true,
      message: this.message,
    });
  }
}
