import { Component, OnInit, Input } from '@angular/core';
import { DashboardStatisticsTypeEnum, Statistics } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { MessagesService } from '../../../utils/messages.service';

@Component({
  selector: 'zu-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @Input() statisticsType: DashboardStatisticsTypeEnum;

  public readonly dashboardStatisticsTypeEnum = DashboardStatisticsTypeEnum;

  public statistics: Statistics;

  constructor(private dashboardService: DashboardService,
              private messagesService: MessagesService ) { }

  ngOnInit() {
    this.getStatistics();
  }

  private getStatistics(): void {
    this.dashboardService.getStatics()
    .subscribe(
        (data) => {
          this.statistics = data;
        },
        () => {
          this.messagesService.showError('send_message.message_send_error') ;
        }
    );
  }
}
