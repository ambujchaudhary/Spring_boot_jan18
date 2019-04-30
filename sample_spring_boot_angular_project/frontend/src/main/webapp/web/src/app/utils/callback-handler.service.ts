import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';

export interface ZuResponse {
  message: string;
  success: boolean;
}

@Injectable({providedIn: 'root'})
export class CallbackHandlerService {
  constructor(private messagesService: MessagesService) {
  }

  public getErrorMessage(errorData: HttpErrorResponse | any) {
    if (errorData.status === 500) {
      return 'Internal server error';
    }

    let message: string;

    if (errorData.error && errorData.error.message) {
      message = this.messagesService.get(errorData.error.message);
      return message.length > 0 ? message : errorData.error.message;

    } else if (errorData.message) {
      message = this.messagesService.get(errorData.message);
      return message.length > 0 ? message : errorData.message;

    } else if (errorData.status === 400 && errorData.responseText) {
      return (JSON.parse(errorData.responseText) || {}).message;

    } else {
      return 'Internal server error';
    }
  }

}
