import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
import { Statistics, WeatherForecast } from './dashboard.model';

@Injectable({providedIn: 'root'})
export class DashboardService {
  prefix: string;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.prefix = this.baseUrl + '/api/protected';
  }

  getWeatherForecast(): Observable<WeatherForecast> {
    return this.httpClient.get<WeatherForecast>(`${this.prefix}/forecast`);
  }

  getStatics(): Observable<Statistics> {
    return this.httpClient.get<Statistics>(`${this.prefix}/statistics`);
  }
}
