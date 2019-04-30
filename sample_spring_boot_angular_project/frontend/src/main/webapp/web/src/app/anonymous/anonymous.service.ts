import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { Token, User } from '../auth/auth.model';
import {
  ChangePasswordFormData,
  ChargbeeSubscriptionData, FacebookUser,
  ForgetPasswordFormData, GoogleUser,
  LoginCredential,
  SignUpFormData,
  SignUpWithSocialFormData, SocialUser
} from './anonymous.model';

@Injectable({providedIn: 'root'})
export class AnonymousService {
  prefix: string;
  prefixProtected: string;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.prefix = this.baseUrl + '/api/public';
    this.prefixProtected = this.baseUrl + '/api/protected';
  }

  login(requestParam: LoginCredential): Observable<Token> {
    return this.httpClient.post<Token>(`${this.prefix}/login`, requestParam);
  }

  signUp(data: SignUpFormData): Observable<Token> {
    return this.httpClient.post<Token>(`${this.prefix}/user`, data);
  }

  signUpWithSocial(data: SignUpWithSocialFormData): Observable<any> {
    return this.httpClient.put<any>(`${this.prefix}/user`, data);
  }

  sendMailRestorePassword(forgetPasswordData: ForgetPasswordFormData): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/forgot`, forgetPasswordData);
  }

  changePassword(changePasswordData: ChangePasswordFormData): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/change-password/`, changePasswordData);
  }

  createChargebeeSubscription(data: ChargbeeSubscriptionData): Observable<ChargbeeSubscriptionData> {
    return this.httpClient.post<ChargbeeSubscriptionData>(`${this.prefixProtected}/subscriptions`, data);
  }

  createFreeSubscription() {
    return this.httpClient.get(`${this.prefixProtected}/subscriptions/free`);
  }

  createNewFreeSubscription() {
    return this.httpClient.get(`${this.prefixProtected}/subscriptions/free/new`);
  }

  mobileAuthWithFacebook(user: FacebookUser) {
    return this.httpClient.post<Token>(`${this.prefix}/facebook`, user);
  }

  mobileAuthWithGoogle(user: GoogleUser) {
    return this.httpClient.post<Token>(`${this.prefix}/google`, user);
  }

  authWithGoogle(user: SocialUser) {
    return this.httpClient.post<Token>(`${this.prefix}/google`, user);
  }

  authWithFacebook(user: SocialUser) {
    return this.httpClient.post<Token>(`${this.prefix}/facebook`, user);
  }

  checkFacebookUser(data: Token): Observable<any> {
    return this.httpClient.post<Token>(`${this.prefix}/facebook/check`, data);
  }
}
