import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AdminDatepickerModelEnum } from '../../admin.model';
import * as moment from 'moment';

@Component({
  selector: 'zu-admin-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
})
export class DatepickerComponent implements OnInit {

  @Input() buttonLabel: string;
  @Input() mode: AdminDatepickerModelEnum;

  @Output() onChange = new EventEmitter<moment.Moment>();

  public startView: 'month' | 'year' | 'multi-year';
  public touchUi = () => window.innerWidth < 480;

  constructor() {}

  ngOnInit() {
    this.initStartView(this.mode);
  }

  private initStartView(mode: AdminDatepickerModelEnum): void {
    switch (mode) {
      case AdminDatepickerModelEnum.DAY:
        this.startView = 'month';
        break;
      case AdminDatepickerModelEnum.MONTH:
        this.startView = 'year';
        break;
      case AdminDatepickerModelEnum.YEAR:
        this.startView = 'multi-year';
        break;
    }
  }

  public dateFilter(d: moment.Moment): boolean {
    return d.isBefore(moment.now());
  }

  public open(datepicker: MatDatepicker<moment.Moment>): void {
    datepicker.open();
  }

  public close(datepicker: MatDatepicker<moment.Moment>): void {
    datepicker.close();
  }

  public onDateSelected(date: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
    if (!this.dateFilter(date)) {
      this.close(datepicker);
      return;
    }

    this.onChange.emit(date);
    this.close(datepicker);
  }

  public onDaySelected(date: MatDatepickerInputEvent<moment.Moment>): void {
    if (!this.dateFilter(date.value)) {
      return;
    }

    this.onChange.emit(date.value);
  }
}
