import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepickerInputEvent } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// tslint:disable-next-line:no-duplicate-imports
import * as _moment from 'moment';

const moment = _moment;
const DATA_FORMAT = 'YYYY-MM-DD';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMMM YYYY',
  },
  display: {
    dateInput: 'DD MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/*
* Example:
*
* <zu-datepicker
*     [min]="moment('1990-12-19')"
*     [max]="moment('2050-06-26')"
*     (onChange)="onChangeHandler($event)">
* </zu-datepicker>
*
* */

@Component({
  selector: 'zu-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
})
export class DatepickerComponent implements OnInit, OnChanges {

  @Input() startDate: Moment;
  @Input() min: Moment;
  @Input() max: Moment;
  @Input() value: Moment;
  @Input() placeholder: string;
  @Input() small = false;

  @Output() onChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (typeof this.startDate === 'undefined') {
      this.startDate = moment();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  public changeHandler(type: string, event: MatDatepickerInputEvent<Date>) {
    const value = moment(event.value).format(DATA_FORMAT);
    return this.onChange.emit(value);
  }

}
