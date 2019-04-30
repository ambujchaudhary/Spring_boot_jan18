import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../utils/storage/local-storage.service';
import { WeatherForecast, WeatherStatusEnum } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { MessagesService } from '../../../utils/messages.service';

@Component({
  selector: 'zu-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {

  public weather: WeatherForecast;
  private readonly weatherStatusEnum = WeatherStatusEnum;

  constructor(
      private dashboardService: DashboardService,
      private messagesService: MessagesService,
      private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getWeatherForecast();

    const oldWeather = this.weather = this.localStorageService.getObject<WeatherForecast>('weather');

    if (oldWeather) {
      this.weather = oldWeather;
    }

  }

  private getWeatherForecast(): void {
    this.dashboardService.getWeatherForecast()
    .subscribe(
        (data) => {
          this.weather = data;
          this.localStorageService.setObject<WeatherForecast>('weather', data);
        },
        () => {
          this.messagesService.showError('send_message.message_send_error');
        }
    );
  }

  public getCorrectPipe(index: number): string {
    if (index === 0) {
      return 'short-month';
    } else {
      return 'calendar-time';
    }
  }

  public setWeatherIcon(weatherStatus: WeatherStatusEnum): string {
    switch (weatherStatus) {
      case this.weatherStatusEnum.CLEAR_DAY:
        return 'clear-day';
      case this.weatherStatusEnum.CLEAR_NIGHT:
        return 'clear-night';
      case this.weatherStatusEnum.CLOUDY:
        return 'cloudy';
      case this.weatherStatusEnum.FOG:
        return 'fog';
      case  this.weatherStatusEnum.RAIN:
        return 'rain';
      case this.weatherStatusEnum.SLEET:
        return 'sleet';
      case  this.weatherStatusEnum.SNOW:
        return 'snow';
      case this.weatherStatusEnum.WIND:
        return 'wind';
      case this.weatherStatusEnum.PARTLY_CLOUDY_DAY:
        return 'partly-cloudy-day';
      case this.weatherStatusEnum.PARTLY_CLOUDY_NIGHT:
        return 'partly-cloudy-night';
      default:
        return 'weather-icon-error';
    }
  }
}
