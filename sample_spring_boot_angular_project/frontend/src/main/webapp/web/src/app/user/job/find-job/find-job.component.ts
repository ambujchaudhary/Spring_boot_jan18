import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MessagesService } from '../../../utils/messages.service';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { JobService } from '../job.service';
import {
  JobFilter,
  JobOverview,
  JobPagination,
  JobSort,
  OwnershipTypeEnum,
  FindJobTabEnum,
  WindowPosition,
  JobStatusEnum, JobPaginationTab, JobFindPaginationOptions
} from '../job.model';
import { MatTabChangeEvent } from '@angular/material';

import { unionBy } from 'lodash/array';
import { FindJobTabLabels } from './find-job.model';

@Component({
  selector: 'zu-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss']
})
export class FindJobComponent implements OnInit {

  public readonly ownershipTypeEnum = OwnershipTypeEnum;
  public readonly jobStatusEnum = JobStatusEnum;
  public readonly findJobTabEnum = FindJobTabEnum;
  readonly findJobTabLabelsEnum = FindJobTabLabels;

  public isRequestInProgress = false;

  public pagination: JobPagination;

  private sort: JobSort;
  private filter: JobFilter;

  private windowPosition = new WindowPosition();

  constructor(
      private jobService: JobService,
      private toasterService: ToasterConfigService,
      private messagesService: MessagesService,
      private route: ActivatedRoute,
      private router: Router,
      private toaster: ToasterConfigService
  ) { }

  ngOnInit() {
    WindowPosition.reset(this.windowPosition);

    this.router.events.subscribe((event) => {
      // Scroll to top if accessing a page, not via browser history stack
      if (event instanceof NavigationEnd) {
        window.scrollTo(this.windowPosition.x, this.windowPosition.y);
        WindowPosition.reset(this.windowPosition);
      }
    });

    this.initPagination();
  }

  private initPagination() {
    this.pagination = {
      size: 20,
      activeTab: this.checkActiveTab(),

      [FindJobTabEnum.AVAILABLE_JOBS]: JobPaginationTab.getDefault(),
      [FindJobTabEnum.MY_APPLICATIONS]: JobPaginationTab.getDefault(),
      [FindJobTabEnum.ACTIVE_JOBS]: JobPaginationTab.getDefault(),
      [FindJobTabEnum.ARCHIVED_JOBS]: JobPaginationTab.getDefault(),
    };

    if (this.pagination.activeTab !== FindJobTabEnum.AVAILABLE_JOBS) {
      this.getMoreJobForActiveTab();
    }
  }

  private checkActiveTab(): FindJobTabEnum {
    const tabQueryParam = this.route.snapshot.queryParams['tab'];
    switch (tabQueryParam) {
      case FindJobTabLabels.MY:
        return FindJobTabEnum.MY_APPLICATIONS;
      case FindJobTabLabels.ACTIVE:
        return FindJobTabEnum.ACTIVE_JOBS;
      case FindJobTabLabels.ARCHIVED:
        return FindJobTabEnum.ARCHIVED_JOBS;
      case FindJobTabLabels.AVAILABLE:
      default:
        return FindJobTabEnum.AVAILABLE_JOBS;
    }
  }

  public getAvailableJobs(data: JobFindPaginationOptions): Observable<JobOverview[]> {
    const sort = JobSort.getParamsAsString(this.sort);
    const dataForRequest = Object.assign({sort}, data, this.filter);

    return this.jobService.getAvailableJobs(dataForRequest);
  }

  private getMyJobs(data: JobFindPaginationOptions): Observable<JobOverview[]> {
    return this.jobService.getOwnJobs(data);
  }

  private getActiveJobs(data: JobFindPaginationOptions): Observable<JobOverview[]> {
    return this.jobService.getActiveJobs(data);
  }

  private getArchivedJobs(data: JobFindPaginationOptions): Observable<JobOverview[]> {
    return this.jobService.getArchivedJobs(data);
  }

  private getJobObservableForActiveTab(data: JobFindPaginationOptions): Observable<JobOverview[]> {
    const {activeTab} = this.pagination;

    switch (activeTab) {
      case FindJobTabEnum.AVAILABLE_JOBS:
        return this.getAvailableJobs(data);
      case FindJobTabEnum.MY_APPLICATIONS:
        return this.getMyJobs(data);
      case FindJobTabEnum.ACTIVE_JOBS:
        return this.getActiveJobs(data);
      case FindJobTabEnum.ARCHIVED_JOBS:
        return this.getArchivedJobs(data);
    }
  }

  public getMoreJobForActiveTab(rewriteExist?: boolean) {
    const {activeTab} = this.pagination;
    if (rewriteExist === true) {
      this.pagination[activeTab].page = 0;
      this.setActiveJobList([]);
    }

    const page = this.pagination[activeTab].page;

    this.isRequestInProgress = true;

    this.getJobObservableForActiveTab({page}).finally(() => {
      this.isRequestInProgress = false;
    })
    .subscribe(
        (jobOverviewData: JobOverview[]) => {
          let tmpJobList: JobOverview[];
          tmpJobList = (rewriteExist === true) ? [...jobOverviewData] : unionBy(this.getActiveJobList(), jobOverviewData, 'id');

          this.setActiveJobList(tmpJobList);
          this.setPaginationLastPage(activeTab, this.detectLastPage(jobOverviewData));
        },
        (error) => {
          this.toaster.error(error.error.message);
        });
  }

  public setSortOptions(newSort: JobSort) {
    this.sort = Object.assign({}, newSort);
  }

  public getAvilableJobIfSortAndFilterReady() {
    if (typeof this.sort !== 'undefined' && typeof this.filter !== 'undefined') {
      this.getMoreJobForActiveTab();
    }
  }

  public updateSortOptions(newSort: JobSort) {

    this.setSortOptions(newSort);
    this.setQueryParams();
    this.getMoreJobForActiveTab(true);
  }

  public setFilterOptions(newFilter: JobFilter) {
    this.filter = Object.assign({}, newFilter);
  }

  public updateFilterOptions(newFilter: JobFilter) {
    this.setFilterOptions(newFilter);
    this.setQueryParams();

    this.getMoreJobForActiveTab(true);
  }

  public changeTab(event: MatTabChangeEvent): void {
    this.pagination.activeTab = event.tab.textLabel as FindJobTabEnum;
    this.pagination[this.pagination.activeTab].page = 0;

    this.getJobsForActiveTab(true);
  }

  public isActiveTab(tab: FindJobTabEnum): boolean {
    return this.pagination.activeTab === tab;
  }

  private getJobsForActiveTab(rewriteExist: boolean): void {
    this.toasterService.hide();
    this.getMoreJobForActiveTab(rewriteExist);
  }

  private saveTabToQueryParams(param: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        tab: param,
      }
    });
  }

  public uploadMoreJob(activeTab: FindJobTabEnum): void {

    if (this.pagination[activeTab].lastPage === false) {
      this.pagination[activeTab].page += 1;
    }

    this.getJobsForActiveTab(false);
  }

  private setPaginationLastPage(tab: FindJobTabEnum, status: boolean) {
    this.pagination[tab].lastPage = status;
  }

  public isNotLastPage(tab: FindJobTabEnum): boolean {
    return this.pagination[tab].lastPage !== true;
  }

  private detectLastPage(jobList: JobOverview[]): boolean {
    return jobList.length < this.pagination.size;
  }

  private setQueryParams() {

    const queryParams = {
      ...this.route.snapshot.queryParams,

      lng: this.filter.lng,
      lat: this.filter.lat,
      location: this.filter.address,
      radius: this.filter.radius,
      jobType: this.filter.jobType,
      dateFrom: this.filter.dateFrom,
      dateTo: this.filter.dateTo,
      hourFrom: this.filter.hourFrom,
      hourTo: this.filter.hourTo,
      amountFrom: this.filter.amountFrom,
      amountTo: this.filter.amountTo,

      key: this.sort.key,
      order: this.sort.order,
    };

    WindowPosition.set(this.windowPosition, window.scrollX, window.scrollY);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });

  }

  public getPageTitleByActiveTab(activeTab: FindJobTabEnum): string {
    const titles = {
      [FindJobTabEnum.AVAILABLE_JOBS]: 'BE CREW',
      [FindJobTabEnum.MY_APPLICATIONS]: 'MY APPLICATIONS',
      [FindJobTabEnum.ACTIVE_JOBS]: 'ACTIVE JOBS',
      [FindJobTabEnum.ARCHIVED_JOBS]: 'ARCHIVED JOBS',
    };

    return titles[activeTab];
  }

  public getTabIndexFromQuery(): number {
    switch (this.route.snapshot.queryParams['tab']) {
      case this.findJobTabLabelsEnum.MY:
        return 1;
      case this.findJobTabLabelsEnum.ACTIVE:
        return 2;
      case this.findJobTabLabelsEnum.ARCHIVED:
        return 3;
      case this.findJobTabLabelsEnum.AVAILABLE:
      default:
        return 0;
    }
  }

  public changeQueryParamsByTab(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 1:
        this.saveTabToQueryParams(this.findJobTabLabelsEnum.MY);
        break;
      case  2:
        this.saveTabToQueryParams(this.findJobTabLabelsEnum.ACTIVE);
        break;
      case  3:
        this.saveTabToQueryParams(this.findJobTabLabelsEnum.ARCHIVED);
        break;
      case 0:
      default:
        this.saveTabToQueryParams(this.findJobTabLabelsEnum.AVAILABLE);
    }
  }

  public showButtonMoreJobs(activeTab: FindJobTabEnum): boolean {
    let result = false;

    if (activeTab) {
      result = this.isNotLastPage(activeTab) && this.getActiveJobList().length > 0;
    }

    return result;
  }

  public getJobListByTab(tab: FindJobTabEnum): JobOverview[] {
    return JobPagination.getJobs(this.pagination, tab) || [];
  }

  private getActiveJobList(): JobOverview[] {
    return this.getJobListByTab(this.pagination.activeTab);
  }

  private setActiveJobList(newJobList: JobOverview[]): void {
    JobPagination.setActiveJobs(this.pagination, newJobList);
  }

  public scrollToTop() {
    // TODO change to dynamically
    const subHeaderOffset = 200;
    const headerOffset = 60;

    const mainContentOffset = subHeaderOffset + headerOffset;
    window.scrollTo(0, mainContentOffset);
  }

}
