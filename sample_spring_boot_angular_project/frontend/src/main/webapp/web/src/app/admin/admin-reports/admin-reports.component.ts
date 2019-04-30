import { Component, Injector, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { MessagesService } from '../../utils/messages.service';
import { ToasterConfigService } from '../../utils/toaster-config.service';
import { AdminDatepickerModelEnum, DownloadUrl, Report, ReportPayloadData } from '../admin.model';
import { AdminService } from '../admin.service';
import * as moment from 'moment';

@Component({
  selector: 'zu-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {

  public report: Report;
  public reportsInfo: string;
  public downloadReportLink: DownloadUrl;
  public hidden = false;

  public readonly adminDatepickerModelEnum = AdminDatepickerModelEnum;
  private platform: Platform;

  constructor(private adminService: AdminService,
              private messagesService: MessagesService,
              private toaster: ToasterConfigService,
              private injector: Injector
  ) {
    try {
      this.platform = injector.get(Platform);
    } catch (e) {
    }

    this.report = new Report();
  }

  public ngOnInit() {
    this.getTimeReport(this.adminDatepickerModelEnum.MONTH, moment());
    this.reportsInfo = moment().format('MMMM YYYY');
  }

  public change(mode: AdminDatepickerModelEnum, date: moment.Moment): void {
    switch (mode) {
      case this.adminDatepickerModelEnum.DAY:
        this.getTimeReport(this.adminDatepickerModelEnum.DAY, date);
        this.reportsInfo = date.format('DD MMMM YYYY');
        return;
      case this.adminDatepickerModelEnum.YEAR:
        this.getTimeReport(this.adminDatepickerModelEnum.YEAR, date);
        this.reportsInfo = date.format('YYYY');
        return;
      case this.adminDatepickerModelEnum.MONTH:
      default:
        this.getTimeReport(this.adminDatepickerModelEnum.MONTH, date);
        this.reportsInfo = date.format('MMMM YYYY');
    }
  }

  private getTimeReport(type: AdminDatepickerModelEnum, date: moment.Moment): void {
    this.adminService.getTimeReport(new ReportPayloadData(date.format('YYYY-MM-DD'), type))
    .subscribe(
        (report: Report) => {
          this.report = report;
        },
        () => {
          this.messagesService.showError('common.message_error');
        });
  }

  public getDownloadReportLink(): void {
    this.hidden = true;
    this.adminService.getDownloadReportLink()
    .finally(
        () => {
          this.hidden = false;
        }
    )
    .subscribe(
        (data) => {
          this.downloadReportLink = data;
          this.toaster.success('Report generated');
        },
        () => {
          this.messagesService.showError('common.message_error');
        }
    );
  }

  public isMobile(): boolean {
    try {
      if (this.platform.is('mobile')) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  public downloadReportMobile(url: string) {
    if (typeof url === 'undefined') {
      return;
    }

    window.open(url, '_system', 'location=no');
  }
}
