import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';
import { BusinessAndPersonalNames } from '../../auth/auth.model';
import {
  Job,
  JobDetailsForModal,
  JobFindOptions,
  JobFindPaginationOptions,
  JobOverview,
  JobReport,
  NewJobResponse,
  NotificationSettings,
  PreExpireJobData
} from './job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  prefix: string;

  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
    this.prefix = this.baseUrl + '/api/protected';
  }

  getNames(): Observable<BusinessAndPersonalNames> {
    return this.httpClient.get<BusinessAndPersonalNames>(`${this.prefix}/full-name`);
  }

  postJob(requestParam: Job): Observable<NewJobResponse> {
    return this.httpClient.post<NewJobResponse>(`${this.prefix}/jobs`, requestParam);
  }

  getJob(id): Observable<Job> {
    return this.httpClient.get<Job>(`${this.prefix}/jobs/${id}`);
  }

  updateJob(requestParam: Job, id): Observable<Job> {
    return this.httpClient.put<Job>(`${this.prefix}/jobs/${id}`, requestParam);
  }

  deleteFile(fullName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.prefix}/attachments/${fullName}`);
  }

  uploadFile(requestParam: File): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({Accept: '*/*'}),
    };

    const formData: FormData = new FormData();
    formData.append('file', requestParam, requestParam.name);

    return this.httpClient.post<any>(`${this.prefix}/attachments`, formData, httpOptions);
  }

  getJobs(): Observable<JobOverview[]> {
    return this.httpClient.get<JobOverview[]>(`${this.prefix}/users/jobs`);
  }

  getOwnJobs(options: JobFindPaginationOptions): Observable<JobOverview[]> {
    let queryParams = new HttpParams();

    Object.keys(options).forEach((param) => {
      if (options[param]) {
        queryParams = queryParams.set(param, options[param]);
      }
    });

    return this.httpClient.get<JobOverview[]>(`${this.prefix}/jobs?tab=my-applications&sort=date,asc`, {params: queryParams});
  }

  getActiveJobs(options: JobFindPaginationOptions): Observable<JobOverview[]> {
    let queryParams = new HttpParams();

    Object.keys(options).forEach((param) => {
      if (options[param]) {
        queryParams = queryParams.set(param, options[param]);
      }
    });

    return this.httpClient.get<JobOverview[]>(`${this.prefix}/jobs?tab=upcoming&sort=date,asc`, {params: queryParams});
  }

  getArchivedJobs(options: JobFindPaginationOptions): Observable<JobOverview[]> {
    let queryParams = new HttpParams();

    Object.keys(options).forEach((param) => {
      if (options[param]) {
        queryParams = queryParams.set(param, options[param]);
      }
    });

    return this.httpClient.get<JobOverview[]>(`${this.prefix}/jobs?tab=archived&sort=date,asc`, {params: queryParams});
  }

  getAvailableJobs(options: JobFindOptions): Observable<JobOverview[]> {
    let queryParams = new HttpParams();

    Object.keys(options).forEach((param) => {
      if (options[param]) {
        queryParams = queryParams.set(param, options[param]);
      }
    });

    return this.httpClient.get<JobOverview[]>(`${this.prefix}/jobs?tab=available`, {params: queryParams});
  }

  cancelApplication(id): Observable<any> {
    return this.httpClient.delete<any>(`${this.prefix}/jobs/${id}/applicants`, id);
  }

  applyForJob(id): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/jobs/${id}/applicants`, id);
  }

  markApplicant(jobId: number, userId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.prefix}/jobs/${jobId}/users/${userId}/mark`, {jobId, userId});
  }

  acceptJobOffer(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.prefix}/jobs/${id}/offers/accept`, id);
  }

  declineJobOffer(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.prefix}/jobs/${id}/offers/decline`, id);
  }

  sendOffer(jobId: string, profileId: string, token: string, fullCharge: boolean): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/jobs/${jobId}/profiles/${profileId}/offers`, {token, fullCharge});
  }

  sendGocardlessOffer(jobId: string, profileId: string, successRedirectUrl: string): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/jobs/${jobId}/profiles/${profileId}/offersGoCardless`, {successRedirectUrl});
  }

  confirmGocardlessOffer(jobId: string, profileId: string, redirectFlowId: string, isCompleted: boolean): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/jobs/${jobId}/profiles/${profileId}/compeleteGoCardlessRedirectFlow`,
                                     {redirectFlowId, isCompleted});
  }

  getJobDetails(jobId: number): Observable<JobDetailsForModal> {
    return this.httpClient.get<JobDetailsForModal>(`${this.prefix}/jobs/${jobId}/modal-with-shooter-name`);
  }

  completeJob(data: JobReport, id: number): Observable<any> {
    return this.httpClient.post<any>(`${this.prefix}/jobs/${id}/complete`, data);
  }

  renewJob(id: number): Observable<number> {
    return this.httpClient.put<number>(`${this.prefix}/jobs/${id}/renew`, id);
  }

  cancelJob(id: number): Observable<number> {
    return this.httpClient.put<number>(`${this.prefix}/jobs/${id}/cancel`, id);
  }

  getNotificationsSettings(): Observable<NotificationSettings> {
    return this.httpClient.get<NotificationSettings>(`${this.prefix}/settings`);
  }

  setNotificationsSettings(data: NotificationSettings): Observable<NotificationSettings> {
    return this.httpClient.put<NotificationSettings>(`${this.prefix}/settings`, data);
  }

  getPreExpireJobs(): Observable<PreExpireJobData[]> {
    return this.httpClient.get<PreExpireJobData[]>(`${this.prefix}/jobs/pre-expire`);
  }
}
