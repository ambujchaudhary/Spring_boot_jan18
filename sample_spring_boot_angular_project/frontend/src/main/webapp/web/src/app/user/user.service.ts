import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { PublicUserProfileData } from '../admin/admin.model';
import { JobReport } from './job/job.model';
import { Subscriptions, SubscriptionType } from './settings/settings.model';
import {
  BusinessProfileData, ChangePasswordData, DeviceInfo, FeedbackData,
  FeedbackPaginationOptions, JobDataForFeedback, ProfileId,
  UserNames,
  UserProfile
} from './user.model';

@Injectable({providedIn: 'root'})
export class UserService {
  prefix: string;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.prefix = this.baseUrl + '/api/protected';
  }

  saveUserProfile(requestParam: UserProfile): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(`${this.prefix}/profiles`, requestParam);
  }

  updateUserProfile(requestParam: UserProfile): Observable<UserProfile> {
    return this.httpClient.put<UserProfile>(`${this.prefix}/profiles`, requestParam);
  }

  uploadCertificate(requestParam: File): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({Accept: '*/*'}),
    };

    const formData: FormData = new FormData();
    formData.append('file', requestParam, requestParam.name);

    return this.httpClient.post<any>(`${this.prefix}/certificate`, formData, httpOptions);
  }

  deleteCertificate(fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.prefix}/certificate/${fileName}`);
  }

  uploadImage(requestParam: File): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({Accept: '*/*'}),
    };

    const formData: FormData = new FormData();
    formData.append('file', requestParam, requestParam.name);

    return this.httpClient.post<any>(`${this.prefix}/image`, formData, httpOptions);
  }

  uploadProfilePhoto(requestParam: File): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({Accept: '*/*'}),
    };

    const formData: FormData = new FormData();
    formData.append('file', requestParam, requestParam.name);

    return this.httpClient.post<any>(`${this.prefix}/profile-image`, formData, httpOptions);
  }

  deleteImage(fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.prefix}/image/${fileName}`);
  }

  deleteProfileImage(fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.prefix}/profile-image/${fileName}`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${this.prefix}/profiles`);
  }

  saveBusinessProfile(requestParam: BusinessProfileData): Observable<BusinessProfileData> {
    return this.httpClient.post<BusinessProfileData>(`${this.prefix}/business-profile`, requestParam);
  }

  updateBusinessProfile(requestParam: BusinessProfileData): Observable<BusinessProfileData> {
    return this.httpClient.put<BusinessProfileData>(`${this.prefix}/business-profile`, requestParam);
  }

  getBusinessProfile(): Observable<BusinessProfileData> {
    return this.httpClient.get<BusinessProfileData>(`${this.prefix}/business-profile`);
  }

  //  TODO
  getSubscriptions(): Observable<Subscriptions[]> {
    return this.httpClient.get<Subscriptions[]>(`${this.prefix}/subscriptions`);
  }

  cancelSubscription(type: SubscriptionType): Observable<SubscriptionType> {
    return this.httpClient.put<SubscriptionType>(`${this.prefix}/subscriptions/cancel`, type);
  }

  getUserProfilePreview(id): Observable<PublicUserProfileData> {
    return this.httpClient.get<PublicUserProfileData>(`${this.prefix}/profiles/${id}`);
  }

  getUserFeedback(options: FeedbackPaginationOptions, id: number): Observable<FeedbackData[]> {
    let params = new HttpParams();

    Object.keys(options).forEach((param) => {
      if (options[param]) {
        params = params.set(param, options[param]);
      }
    });

    return this.httpClient.get<FeedbackData[]>(`${this.prefix}/profiles/${id}/feedback`, {params});
  }

  getJobsForShooterFeedback(): Observable<JobDataForFeedback[]> {
    return this.httpClient.get<JobDataForFeedback[]>(`${this.prefix}/feedback/business`);
  }

  getUserNames(): Observable<UserNames> {
    return this.httpClient.get<UserNames>(`${this.prefix}/profile-names`);
  }

  leaveFeedbackAsShooter(data: JobReport, id: string): Observable<JobReport> {
    return this.httpClient.post<JobReport>(`${this.prefix}/jobs/${id}/feedback/business`, data);
  }

  leaveFeedbackAsBusiness(data: JobReport, id: string): Observable<JobReport> {
    return this.httpClient.post<JobReport>(`${this.prefix}/jobs/${id}/feedback/shooter`, data);
  }

  getAutocompleteJobs(): Observable<JobDataForFeedback[]> {
    return this.httpClient.get<JobDataForFeedback[]>(`${this.prefix}/feedback/shooter`);
  }

  changePassword(data: ChangePasswordData): Observable<ChangePasswordData> {
    return this.httpClient.put<ChangePasswordData>(`${this.prefix}/user`, data);
  }

  //  TODO
  sendDeviceInfo(data: DeviceInfo): Observable<DeviceInfo> {
    return this.httpClient.post<DeviceInfo>(`${this.prefix}/firebase`, data);
  }

  getProfileId(id: string): Observable<ProfileId> {
    return this.httpClient.get<ProfileId>(`${this.prefix}/users/${id}/profiles`);
  }

  saveProfileForLater(requestParam: UserProfile): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(`${this.prefix}/profiles/later`, requestParam);
  }
}
