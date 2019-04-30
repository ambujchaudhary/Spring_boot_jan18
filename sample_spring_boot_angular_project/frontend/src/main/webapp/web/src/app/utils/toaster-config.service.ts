import { Injectable } from '@angular/core';
import {
  MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material';

export type ToasterType = 'success' | 'error' | 'info' | 'warning';

@Injectable({providedIn: 'root'})
export class ToasterConfigService {
  setAutoHide = true;
  autoHide = 6000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  public config: MatSnackBarConfig = {
    verticalPosition: this.verticalPosition,
    horizontalPosition: this.horizontalPosition,
    duration: this.setAutoHide === true ? this.autoHide : 0,
  };

  constructor(public snackBar: MatSnackBar) {
  }

  public success(message: string): void {
    this.config.panelClass = 'success-message';
    this.snackBar.open(message, '', this.config);
  }

  public error(message: string): void {
    this.config.panelClass = 'error-message';
    this.snackBar.open(message, '', this.config);
  }

  public info(message: string): void {
    this.config.panelClass = 'info-message';
    this.snackBar.open(message, '', this.config);
  }

  public warning(message: string): void {
    this.config.panelClass = 'warning-message';
    this.snackBar.open(message, '', this.config);
  }

  public hide(): void {
    this.snackBar.dismiss();
  }
}
