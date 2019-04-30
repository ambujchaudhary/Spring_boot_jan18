import { Injectable } from '@angular/core';
import { StarsEnum } from '../user/job/job.model';
import { MessagesService } from './messages.service';
import { ToasterConfigService } from './toaster-config.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class JobUtilsService {

  private readonly starEnum = StarsEnum;

  constructor(private toaster: ToasterConfigService,
              private validationService: ValidationService,
              private messagesService: MessagesService) { }

  public jobFeedbackValidation(rate: number, review: string): boolean {
    let result = false;
    this.toaster.hide();

    if (rate <= 0) {
      this.messagesService.showError('complete_job.rate_empty');
    } else if (this.validationService.isStringNotEmpty(review) === false) {
      this.messagesService.showError('complete_job.review_filed_empty');
    } else if (this.validationService.isWordsLessThan(review, 20) === true) {
      this.messagesService.showError('complete_job.review_field_less_20_words');
    } else {
      result = true;
    }

    return result;
  }

  public getStarsByValue(value: number): StarsEnum {
    const obj = {
      1: this.starEnum.ONE,
      2: this.starEnum.TWO,
      3: this.starEnum.THREE,
      4: this.starEnum.FOUR,
      5: this.starEnum.FIVE,
    };

    return obj[value];
  }

  public copyLink(value: string) {
    const tempBox = document.createElement('textarea');
    tempBox.style.position = 'fixed';
    tempBox.style.left = '0';
    tempBox.style.top = '0';
    tempBox.style.opacity = '0';
    tempBox.value = value;
    document.body.appendChild(tempBox);
    tempBox.focus();
    tempBox.select();
    document.execCommand('copy');
    document.body.removeChild(tempBox);

    this.messagesService.showSuccess('complete_job.copied_to_clipboard.message_success');
  }
}
