import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { BusinessAndPersonalNames } from '../auth/auth.model';
import { Job } from '../user/job/job.model';
import { ZuResponse } from '../utils/callback-handler.service';

import {
  AdminDeclineFeedbackData, AdminJobsManagementInfo,
  AdminUserManagementInfo, DownloadUrl, EditedProfileData, PrivateUserProfileData, Report, ReportPayloadData, UserProfileForEditData,
} from './admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  prefix: string;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.prefix = this.baseUrl + '/api/private';
  }

  getUsers(): Observable<AdminUserManagementInfo> {
    return this.httpClient.get<AdminUserManagementInfo>(`${this.prefix}/profiles`);
  }

  getUserProfileData(id: number): Observable<PrivateUserProfileData> {
    return this.httpClient.get<PrivateUserProfileData>(`${this.prefix}/users/${id}/profiles`);
  }

  getNames(id: number): Observable<BusinessAndPersonalNames> {
    return this.httpClient.get<BusinessAndPersonalNames>(`${this.prefix}/users/${id}/full-name`);
  }

  sendAdminDeclineFeedback(data: AdminDeclineFeedbackData): Observable<ZuResponse> {
    const saveData = {comment: data.comment};
    const id = data.id;

    return this.httpClient.put<ZuResponse>(`${this.prefix}/users/${id}/profiles/failed`, saveData);
  }

  approveUserProfile(id: number): Observable<ZuResponse> {
    return this.httpClient.put<ZuResponse>(`${this.prefix}/users/${id}/profiles/success`, id);
  }

  getJobsForManagement(): Observable<AdminJobsManagementInfo> {
    return this.httpClient.get<AdminJobsManagementInfo>(`${this.prefix}/jobs`);
  }

  closeJob(id: number): Observable<number> {
    return this.httpClient.put<number>(`${this.prefix}/jobs/${id}/done`, id);
  }

  editJob(data: Job, id: number): Observable<Job> {
    return this.httpClient.put<Job>(`${this.prefix}/jobs/${id}`, data);
  }

  blockUser(id: string): Observable<string> {
    return this.httpClient.put<string>(`${this.prefix}/users/${id}/block`, id);
  }

  unblockUser(id: string): Observable<string> {
    return this.httpClient.put<string>(`${this.prefix}/users/${id}/unblock`, id);
  }

  getUserProfileDataForEdit(id: number): Observable<UserProfileForEditData> {
    return this.httpClient.get<UserProfileForEditData>(`${this.prefix}/users/${id}`);
  }

  editUserProfile(data: EditedProfileData, id: number): Observable<EditedProfileData> {
    return this.httpClient.put<EditedProfileData>(`${this.prefix}/users/${id}`, data);
  }

  getTimeReport(data: ReportPayloadData): Observable<Report> {
    return this.httpClient.get<Report>(`${this.prefix}/report`, {params: {date: data.date, type: data.type}});
  }

  getDownloadReportLink(): Observable<DownloadUrl> {
    return this.httpClient.get<DownloadUrl>(`${this.prefix}/report/download`);
  }
}
