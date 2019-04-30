import { Component, OnInit } from '@angular/core';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { AdminJobsManagementInfo } from '../admin.model';
import { AdminService } from '../admin.service';
import { MessagesService } from '../../utils/messages.service';

@Component({
  selector: 'zum-jobs-management',
  templateUrl: './jobs-management.component.html',
  styleUrls: ['./jobs-management.component.scss']
})
export class JobsManagementComponent implements OnInit {

  public adminManagementData: AdminJobsManagementInfo;

  public searchJob = '';

  constructor(
      private adminService: AdminService,
      private toaster: ToasterConfigService,
      private messagesService: MessagesService
  ) { }

  ngOnInit() {
    this.getJobsForManagement();
  }

  private getJobsForManagement(): void {
    this.adminService.getJobsForManagement()
    .subscribe(
        (data) => {
          this.adminManagementData = data;
        },
        () => {
          this.messagesService.showError('common.message_error');
        });
  }

  public setCompletedJobsTabLabel(): string {
    if (typeof this.adminManagementData !== 'undefined') {
      return `COMPLETED JOBS(${this.adminManagementData.pendingCounter})`;
    }
  }

  public setClosedJobsTabLabel(): string {
    if (typeof this.adminManagementData !== 'undefined') {
      return `CLOSED JOBS(${this.adminManagementData.closedCounter})`;
    }
  }

  public setAllJobsTabLabel(): string {
    if (typeof this.adminManagementData !== 'undefined') {
      return `ALL JOBS(${this.adminManagementData.allCounter})`;
    }
  }

  public closeJob(arrayId: number, jobId: number): void {
    this.adminService.closeJob(jobId).subscribe(
        () => {
          this.messagesService.showSuccess('complete_job.job_closed.message_success');
          this.adminManagementData.pendingCounter = (parseInt(this.adminManagementData.pendingCounter, 10) - 1).toString();
          this.adminManagementData.closedCounter = (parseInt(this.adminManagementData.closedCounter, 10) + 1).toString();
          this.adminManagementData.closed.unshift(this.adminManagementData.pending[arrayId]);
          this.adminManagementData.pending.splice(arrayId, 1);
        },
        () => {
          this.messagesService.showError('common.message_error');
        }
    );
  }

  public getUserPageUrl(id: number): string {
    return `/admin/user-profile/${id}`;
  }
}
