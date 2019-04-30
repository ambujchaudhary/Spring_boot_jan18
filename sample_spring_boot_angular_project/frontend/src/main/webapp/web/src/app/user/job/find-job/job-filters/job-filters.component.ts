import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as _moment from 'moment';
import { MessagesService } from '../../../../utils/messages.service';
import { ToasterConfigService } from '../../../../utils/toaster-config.service';
import { ValidationService } from '../../../../utils/validation.service';
import { JobFilter, JobTypeEnum, Radius } from '../../job.model';
import { MatCheckboxChange } from '@angular/material';
import { GoogleAutocompleteResult } from '../../../../shared/google-autocomplete/google-autocomplete.model';
import { ActivatedRoute, Router } from '@angular/router';

const moment = _moment;

type JobFilterKey = 'dateFrom' | 'dateTo' | 'hourFrom' | 'hourTo' | 'amountFrom' | 'amountTo';
type InputParamsKeys = 'hour' | 'amount' | 'date';

const defaultSliderValue = 4;

@Component({
  selector: 'zu-job-filters',
  templateUrl: './job-filters.component.html',
  styleUrls: ['./job-filters.component.scss']
})
export class JobFiltersComponent implements OnInit {

  @Output() initOptions = new EventEmitter<JobFilter>();
  @Output() changeOptions = new EventEmitter<JobFilter>();

  public isFilterOpen: boolean;
  public readonly JobTypeEnum = JobTypeEnum;
  public sliderValue = defaultSliderValue;

  //  TODO refactor and change
  public filter: JobFilter;

  public inputDateParams = {
    min: moment().add(1, 'day'),
    minAble: moment()
  };

  public inputParams = {
    hour: {
      min: 1,
      step: 0.5,
      max: 9999,
    },
    amount: {
      min: 0,
      step: 1,
      max: 999999.99,
    }
  };

  public radiusOptions: Radius[];

  constructor(private route: ActivatedRoute,
              private validationService: ValidationService,
              private router: Router,
              private messagesService: MessagesService,
              private toaster: ToasterConfigService) { }

  ngOnInit() {
    this.radiusOptions = [10, 50, 100, 300, 500, 1000];
    this.isFilterOpen = false;
    this.filter = JobFilter.getDefault();
    this.getQueryParams();

    let filterToEmit: JobFilter;
    filterToEmit = this.isFilterOpen ? JobFilter.getFullFilterData(this.filter) : JobFilter.getBaseFilterData(this.filter);
    this.initOptions.emit(filterToEmit);
  }

  private setRadius(value: number) {
    const obj = {
      1: '10',
      2: '50',
      3: '100',
      4: '300',
      5: '500',
      6: '1000',
    };

    return obj[value];
  }

  private getRadiusByValue(radius: Radius) {
    const obj = {
      10: 1,
      50: 2,
      100: 3,
      300: 4,
      500: 5,
      1000: 6,
    };

    return obj[radius];
  }

  private isNotUndefined(param) {
    return typeof param !== 'undefined';

  }

  //  TODO fix and finish
  private getQueryParams() {
    const radius = this.route.snapshot.queryParams['radius'];

    if (this.isNotUndefined(radius)) {
      this.filter.radius = radius;
      this.sliderValue = this.getRadiusByValue(this.filter.radius);
    }

    const jobType = this.route.snapshot.queryParams['jobType'];

    if (this.isNotUndefined(jobType) && Array.isArray(jobType)) {
      this.filter.jobType = jobType;
    } else if ((jobType || '').length > 0) {
      this.filter.jobType = [jobType];
    }

    const location = this.route.snapshot.queryParams['location'];
    const lat = this.route.snapshot.queryParams['lat'];
    const lng = this.route.snapshot.queryParams['lng'];

    if (this.isNotUndefined(location) && this.isNotUndefined(lng) && this.isNotUndefined(lat)) {
      this.filter.lat = lat;
      this.filter.lng = lng;
      this.filter.address = location;
    }

    const dateFrom = this.route.snapshot.queryParams['dateFrom'];
    const dateTo = this.route.snapshot.queryParams['dateTo'];
    const hourFrom = this.route.snapshot.queryParams['hourFrom'];
    const hourTo = this.route.snapshot.queryParams['hourTo'];
    const amountFrom = this.route.snapshot.queryParams['amountFrom'];
    const amountTo = this.route.snapshot.queryParams['amountTo'];

    if (this.isNotUndefined(dateFrom) || this.isNotUndefined(dateTo) || this.isNotUndefined(hourFrom) || this.isNotUndefined(hourTo) ||
        this.isNotUndefined(amountFrom) || this.isNotUndefined(amountTo)) {
      this.isFilterOpen = true;

      this.filter.dateFrom = dateFrom;
      this.filter.dateTo = dateTo;
      this.filter.hourFrom = hourFrom;
      this.filter.hourTo = hourTo;
      this.filter.amountFrom = amountFrom;
      this.filter.amountTo = amountTo;
    }
  }

  private isValidAutocompleteLocation() {
    const isTextFieldEmpty = this.validationService.isStringNotEmpty(this.filter.address);

    if (!this.filter.lat || !this.filter.lng || !isTextFieldEmpty) {
      this.messagesService.showWarning('google_autocomplete.location_is_not_included_to_search');
    }

    // always return true because location is not required field
    return true;
  }

  private isValidInputGroup(key: InputParamsKeys, valueFrom: string, valueTo: string): boolean {
    let result = false;

    if (this.validationService.isStringNotEmpty(valueFrom)) {
      result = key === 'date' ? this.isFirstDateInputValid(key, valueFrom, valueTo) : this.isFirstInputValid(key, valueFrom, valueTo);

    } else if (this.validationService.isStringNotEmpty(valueTo)) {
      result = key === 'date' ? this.isSecondDateInputValid(key, valueTo) : this.isSecondInputValid(key, valueTo);

    } else {
      result = true;
    }

    return result;
  }

  private isFirstInputValid(key: InputParamsKeys, valueFrom: string, valueTo: string): boolean {
    let result = false;

    const tmpValueFrom = parseFloat(valueFrom);

    if (tmpValueFrom < this.inputParams[key].min) {
      this.messagesService.showError(`be_crew.${key}.from_less_min`, [this.inputParams[key].min]);
    } else if (tmpValueFrom > this.inputParams[key].max) {
      this.messagesService.showError(`be_crew.${key}.from_more_max`, [this.inputParams[key].max]);

    } else {
      if (this.validationService.isStringNotEmpty(valueTo)) {
        const tmpValueTo = parseFloat(valueTo);

        if (tmpValueTo === tmpValueFrom) {
          this.messagesService.showError(`be_crew.${key}.equal`);
        } else if (tmpValueTo < tmpValueFrom) {
          this.messagesService.showError(`be_crew.${key}.less_first`, [tmpValueFrom]);
        } else if (tmpValueTo > this.inputParams[key].max) {
          this.messagesService.showError(`be_crew.${key}.to_more_max`, [this.inputParams[key].max]);

        } else {
          result = true;
        }

      } else {
        result = true;
      }
    }

    return result;
  }

  private isSecondInputValid(key: InputParamsKeys, valueTo: string): boolean {
    let result = false;

    const tmpValueTo = parseFloat(valueTo);

    if (tmpValueTo < this.inputParams[key].min) {
      this.messagesService.showError(`be_crew.${key}.to_less_min`, [this.inputParams[key].min]);

    } else if (tmpValueTo > this.inputParams[key].max) {
      this.messagesService.showError(`be_crew.${key}.to_more_max`, [this.inputParams[key].max]);

    } else {
      result = true;
    }

    return result;
  }

  private isFirstDateInputValid(key: InputParamsKeys, valueFrom: string, valueTo: string): boolean {
    let result = false;

    const tmpValueFrom = moment(valueFrom);

    if (tmpValueFrom.diff(this.inputDateParams.minAble) < 0) {
      this.messagesService.showError(`be_crew.date.from_less_min`, [this.inputDateParams.minAble]);
    } else {
      if (this.validationService.isStringNotEmpty(valueTo)) {
        const tmpValueTo = moment(valueTo);

        if (valueFrom === valueTo) {
          this.messagesService.show(`be_crew.date.equal`);
        } else if (tmpValueFrom.diff(tmpValueTo) > 0) {
          this.messagesService.showError(`be_crew.date.less_first`, [tmpValueFrom]);
        } else {
          result = true;
        }

      } else {
        result = true;
      }
    }

    return result;
  }

  private isSecondDateInputValid(key: InputParamsKeys, valueTo: string): boolean {
    let result = false;

    const tmpValueTo = moment(valueTo);

    if (tmpValueTo.diff(this.inputDateParams.minAble) < 0) {
      this.messagesService.showError(`be_crew.date.to_less_min`, [this.inputDateParams.minAble]);

    } else {
      result = true;
    }

    return result;
  }

  public toggleFilterStatus() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  public toggleType(role: JobTypeEnum, event: MatCheckboxChange) {

    const currentJobTypes = this.filter.jobType || [];

    if (event.checked === true) {
      this.filter.jobType = [...currentJobTypes, role];
    } else {
      this.filter.jobType = currentJobTypes.filter((roleItem) => roleItem !== role);
    }
  }

  public applyFilters() {
    this.toaster.hide();

    if (this.isValidAutocompleteLocation() === false) {
      return;
    }

    if (this.isValidInputGroup('date', this.filter.dateFrom, this.filter.dateTo) === false) {
      return;
    }

    if (this.isValidInputGroup('hour', this.filter.hourFrom, this.filter.hourTo) === false) {
      return;
    }

    if (this.isValidInputGroup('amount', this.filter.amountFrom, this.filter.amountTo) === false) {
      return;
    }

    this.filter.radius = this.setRadius(this.sliderValue);

    let filterToEmit: JobFilter;

    filterToEmit = this.isFilterOpen ? JobFilter.getFullFilterData(this.filter) : JobFilter.getBaseFilterData(this.filter);

    this.changeOptions.emit(filterToEmit);
  }

  public cleanFilters() {
    this.sliderValue = defaultSliderValue;
    const _filter = JobFilter.getDefault();
    _filter.address = '';

    this.filter = _filter;

    this.changeOptions.emit(this.filter);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  public setFilterValueByKey(key: JobFilterKey, value: string): void {
    this.filter[key] = value;
  }

  public getAddress(data: GoogleAutocompleteResult) {
    this.filter.address = data.input;
    this.filter.lat = data.place.geometry.location.lat();
    this.filter.lng = data.place.geometry.location.lng();
  }
}
