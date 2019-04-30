import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
import { ZuResponse } from '../../utils/callback-handler.service';
import { Subscribers } from './choose-country.model';

@Injectable({providedIn: 'root'})
export class ChooseCountryService {

  public prefix: string;
  public prefixProtected: string;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.prefix = this.baseUrl + '/api/public';
    this.prefixProtected = this.baseUrl + '/api/protected';
  }

  public subscribe(requestParam: Subscribers): Observable<ZuResponse> {
    return this.httpClient.post<ZuResponse>(`${this.prefix}/subscribers`, requestParam);
  }
}
