import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from '../../../user/job/job.model';
import { JobService } from '../../../user/job/job.service';

@Component({
  selector: 'zu-jobs-management-edit',
  templateUrl: './jobs-management-edit.component.html',
  styleUrls: ['./jobs-management-edit.component.scss']
})
export class JobsManagementEditComponent implements OnInit {
  public jobView: Job;

  constructor(
      private jobService: JobService,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getJob();
  }

  private getJob(): void {
    this.route.data.subscribe((data: {job: Job}) => {

      this.jobView = data.job;

    });
  }

}
