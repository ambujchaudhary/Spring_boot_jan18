import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JobSort, JobSortOrderEnum, JobSortKeyEnum } from '../../job.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'zu-job-sort',
  templateUrl: './job-sort.component.html',
  styleUrls: ['./job-sort.component.scss']
})
export class JobSortComponent implements OnInit {

  @Output() initOptions = new EventEmitter<JobSort>();
  @Output() changeOptions = new EventEmitter<JobSort>();

  public sort: JobSort;
  public readonly JobSortKeyEnum = JobSortKeyEnum;

  constructor(
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sort = new JobSort();
    this.getQueryParams();
    this.initOptions.emit(this.sort);
  }

  private isNotUndefined(param) {
    return typeof param !== 'undefined';

  }

  private getQueryParams() {
    const order = this.route.snapshot.queryParams['order'];

    if (this.isNotUndefined(order)) {
      this.sort.order = order;
    }

    const key = this.route.snapshot.queryParams['key'];

    if (this.isNotUndefined(key)) {
      this.sort.key = key;
    }
  }

  public applySortDate(setDefaultOrder: boolean) {
    this.sort.key = JobSortKeyEnum.DATE;

    if (setDefaultOrder === true) {
      this.sort.order = JobSortOrderEnum.DESC;
    } else {
      this.sort.order = JobSort.changeOrder(this.sort.order);
    }

    this.changeOptions.emit(this.sort);
  }

  public applySortJobType(setDefaultOrder: boolean) {
    this.sort.key = JobSortKeyEnum.JOB_TYPE;

    if (setDefaultOrder === true) {
      this.sort.order = JobSortOrderEnum.ASC;
    } else {
      this.sort.order = JobSort.changeOrder(this.sort.order);
    }

    this.changeOptions.emit(this.sort);
  }

  public setActiveSorkKey(key: JobSortKeyEnum): boolean {
    return this.sort.key === key;
  }

  public setActiveArrow(): boolean {
    return this.sort.order === JobSortOrderEnum.DESC;
  }
}
