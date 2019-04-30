import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterConfigService } from '../../../utils/toaster-config.service';
import { JobOverview, JobStatusEnum, OwnershipTypeEnum } from '../job.model';
import { JobService } from '../job.service';
import { TabLabelsEnum } from './jobs.model';

@Component({
  selector: 'zu-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  readonly ownershipTypeEnum = OwnershipTypeEnum;
  readonly tabLabelsEnum = TabLabelsEnum;

  public activeTab: number;

  public jobsWithStatuses = {
    newJobs: [],
    activeJobs: [],
    closedJobs: [],
  };

  constructor(private jobService: JobService,
              private router: Router,
              private route: ActivatedRoute,
              private toaster: ToasterConfigService
  ) { }

  ngOnInit() {
    this.jobService.getJobs().subscribe(
        (jobOverviewData: JobOverview[]) => {
          this.filterJobs(jobOverviewData);
        },
        (error) => {
          this.toaster.error(error.error.message);
        });
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

  public filterJobs(jobList: JobOverview[]) {
    if (typeof jobList === 'undefined') {
      return;
    }

    this.jobsWithStatuses = {newJobs: [], activeJobs: [], closedJobs: []};

    return jobList.forEach((job) => {
      switch (job.status) {
        case JobStatusEnum.NEW:
          this.jobsWithStatuses.newJobs.push(job);
          break;
        case JobStatusEnum.WAITING_FOR_RESPONSE:
          this.jobsWithStatuses.newJobs.push(job);
          break;
        case JobStatusEnum.OFFER_ACCEPTED:
          this.jobsWithStatuses.activeJobs.push(job);
          break;
        case JobStatusEnum.IN_PROGRESS:
          this.jobsWithStatuses.activeJobs.push(job);
          break;
        case JobStatusEnum.CANCELLED:
          this.jobsWithStatuses.closedJobs.push(job);
          break;
        case JobStatusEnum.COMPLETED:
          this.jobsWithStatuses.closedJobs.push(job);
          break;
        case JobStatusEnum.DONE:
          this.jobsWithStatuses.closedJobs.push(job);
          break;
        default:
          this.jobsWithStatuses.newJobs.push(job);
      }
    });

  }

  public getTabIndexFromQuery(): number {
    switch (this.route.snapshot.queryParams['tab']) {
      case this.tabLabelsEnum.active:
        return 1;
      case this.tabLabelsEnum.archived:
        return 2;
      case this.tabLabelsEnum.pending:
      default:
        return 0;
    }
  }

  public changeQueryParamsByTab(event: MatTabChangeEvent): void {

    switch (event.index) {
      case 1:
        this.saveTabToQueryParams(this.tabLabelsEnum.active);
        break;
      case  2:
        this.saveTabToQueryParams(this.tabLabelsEnum.archived);
        break;
      case 0:
      default:
        this.saveTabToQueryParams(this.tabLabelsEnum.pending);
    }
  }
}
