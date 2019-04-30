import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

type ZuFormatDate = 'default' | 'short' | 'year' | 'month-day' | 'DD MMMM YYYY' | undefined;

@Pipe({
  name: 'zuDate',
})

export class ZuDatePipe implements PipeTransform {
  transform(value: Date | moment.Moment, ...args: string[]): string {
    const [format = 'DD MMMM YYYY'] = args;
    let _format: string;

    switch (format) {
      case 'short':
        _format = 'DD.MM.YY';
        break;
      case 'year':
        _format = 'YYYY';
        break;
      case 'month-day':
        _format = 'MMM DD';
        break;
      case 'short-month':
        _format = 'DD MMM YYYY';
        break;
      case 'relative-time':
        _format = 'lll';
        break;
      case 'hours-minutes':
        _format = 'LT';
        break;
      case 'calendar-time':
        _format = 'ddd, DD MMM';
        break;
      case 'default':
      default:
        _format = format;

    }

    if (typeof value === 'undefined') {
      return '';
    }

    return moment(value).format(_format);
  }
}
