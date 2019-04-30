import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs';
import { environment } from '../../../../environments/environment';

import { User } from './auth.model';

@Injectable()
export class AuthService {
  prefix: string;
  prefixProtected: string;

  private baseUrl = environment.baseUrl;

  constructor(
      private httpClient: HttpClient
  ) {
    this.prefix = this.baseUrl + '/api/public';
    this.prefixProtected = this.baseUrl + '/api/protected';
  }

  getUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.prefix}/user`);
  }

  public setToken(token: string): void {
    if (token) {
      localStorage.setItem('access_token', token);
    }
  }

  public destroyToken(): void {
    if (localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token');
    }
  }

  public getToken(): string {
    return localStorage.getItem('access_token');
  }
}
