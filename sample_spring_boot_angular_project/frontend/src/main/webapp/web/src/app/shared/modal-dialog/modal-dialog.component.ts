import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'zu-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
})
export class ModalDialogComponent implements OnInit {

  @Input() description = '';
  @Input() title = '';
  @Input() actionButtonText = '';
  @Input() buttonClass = 'info';
  @Input() rejectButtonText = 'GO BACK';

  public date: string;

  constructor(private dialogRef: MatDialogRef<ModalDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

    if (data !== null) {
      this.date = data.date;
    }
  }

  public cancel() {
    this.dialogRef.close(true);
  }

  ngOnInit() {
  }

}
