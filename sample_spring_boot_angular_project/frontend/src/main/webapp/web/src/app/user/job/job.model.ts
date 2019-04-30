import { BusinessAndPersonalNames } from '../../auth/auth.model';
import { SubscriptionTypeEnum } from '../settings/settings.model';
import { UploadedFile, Location } from '../user.model';

export enum JobTypeEnum {
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  VIDEOGRAPHER = 'VIDEOGRAPHER',
  DRONE_OPERATOR = 'DRONE_OPERATOR',
  PHOTO_EDITOR = 'PHOTO_EDITOR',
  VIDEO_EDITOR = 'VIDEO_EDITOR',
  ASSISTANT = 'ASSISTANT',
}

export class Job {
  applicants?: JobApplicants[];
  ownerType: OwnerNameEnum;
  ownerName: string;
  ownerId?: string;
  ownerProfileId?: string;
  title: string;
  date: string;
  location: Location;
  brief?: string;
  pricePerHour: string;
  numberOfHour: string;
  attachment?: UploadedFile[];
  status?: JobStatusEnum;
  ownershipType?: OwnershipTypeEnum;
  lastAction: string;

  constructor(
      public workerRoles: JobTypeEnum[] = [],
      public equipment: string[] = []
  ) {}
}

export interface JobApplicants {
  firstName: string;
  lastName: string;
  id: number;
  profileId: number;
  date: string;
  marked: boolean;
  hired: boolean;

  // only for client side
  inProgress: boolean;
}

export enum OwnerNameEnum {
  PERSONAL_NAME = 'PERSONAL_NAME',
  BUSINESS_NAME = 'BUSINESS_NAME',
}

export enum JobStatusEnum {
  NEW = 'NEW',
  WAITING_FOR_RESPONSE = 'WAITING_FOR_RESPONSE',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum OwnershipTypeEnum {
  OWNER = 'OWNER',
  VIEWER = 'VIEWER',
  APPLICANT = 'APPLICANT',
  CHOSEN_APPLICANT = 'CHOSEN_APPLICANT',
  SHOOTER = 'SHOOTER',
  OFFER_DECLINED = 'OFFER_DECLINED',

  // only for client side
  ADMIN = 'ADMIN',
}

export class JobOverview {
  id: string;
  address: string;
  applicants: number;
  brief: string;
  date: string;
  numberOfHour: string;
  ownerType: OwnerNameEnum;
  ownerId: string;
  shooterId: string;
  shooterFullName: string;
  pricePerHour: string;
  title: string;
  workerRoles: JobTypeEnum[];
  status: JobStatusEnum;
  ownershipType: OwnershipTypeEnum;
  lastAction: string;
}

export interface NewJobResponse {
  id: string;
}

export class JobFindPaginationOptions {
  sort?: string;
  size?: number;
  page: number;
}

export type JobFindOptions = JobFilter & JobFindPaginationOptions;

export class JobFilter {
  radius: Radius;
  jobType?: JobTypeEnum[] = [];

  lat?: string;
  lng?: string;
  dateFrom?: string;
  dateTo?: string;
  hourFrom?: string;
  hourTo?: string;
  amountFrom?: string;
  amountTo?: string;

  // only for client side
  address?: string;

  static getDefault() {
    const data = new JobFilter();

    data.radius = 300;
    data.jobType = [];
    data.address = '';

    return data;
  }

  static getBaseFilterData(data: JobFilter): JobFilter {
    const {radius, lat, lng, jobType, address} = data;

    const baseData = {radius, lat, lng, jobType, address};
    JobFilter.checkJobTypeAndDeleteIfEmpty(baseData);
    JobFilter.checkLocationAndDeleteIfEmpty(baseData);

    return baseData;
  }

  static getFullFilterData(data: JobFilter): JobFilter {
    const tmpData = Object.assign({}, data);
    JobFilter.checkJobTypeAndDeleteIfEmpty(tmpData);
    JobFilter.checkLocationAndDeleteIfEmpty(tmpData);

    return tmpData;
  }

  static checkJobTypeAndDeleteIfEmpty(data: JobFilter): void {
    if (Array.isArray(data.jobType) === false || data.jobType.length === 0) {
      delete data.jobType;
    }
  }

  static checkLocationAndDeleteIfEmpty(data: JobFilter): void {
    if ((data.address || '').trim().length === 0) {
      delete data.address;
      delete data.lat;
      delete data.lng;
    }
  }
}

export type Radius = 10 | 50 | 100 | 300 | 500 | 1000;

export class JobSort {
  static changeOrder(currentOrder: JobSortOrderEnum): JobSortOrderEnum {
    return (currentOrder === JobSortOrderEnum.ASC) ? JobSortOrderEnum.DESC : JobSortOrderEnum.ASC;
  }

  static getParamsAsString(data: JobSort): string {
    const {key, order} = data;

    return `${key},${order}`;
  }

  constructor(public key: JobSortKeyEnum = JobSortKeyEnum.DATE, public order: JobSortOrderEnum = JobSortOrderEnum.ASC) {
  }
}

export enum JobSortKeyEnum {
  DATE = 'date',
  JOB_TYPE = 'workerRoles'
}

export enum JobSortOrderEnum {
  ASC = 'asc',
  DESC = 'desc'
}

export type JobPaginationTabKey = 'available';

export class JobPaginationTab {
  page: number;
  lastPage: boolean;
  jobs: JobOverview[];

  public static getDefault(): JobPaginationTab {
    return {page: 0, lastPage: false, jobs: []};
  }
}

export enum FindJobTabEnum {
  AVAILABLE_JOBS = 'Available jobs',
  MY_APPLICATIONS = 'My Applications',
  ACTIVE_JOBS = 'Active jobs',
  ARCHIVED_JOBS = 'Archived jobs',
}

export class JobPagination {
  size: number;
  activeTab: FindJobTabEnum;

  [FindJobTabEnum.AVAILABLE_JOBS]: JobPaginationTab;
  [FindJobTabEnum.MY_APPLICATIONS]: JobPaginationTab;
  [FindJobTabEnum.ACTIVE_JOBS]: JobPaginationTab;
  [FindJobTabEnum.ARCHIVED_JOBS]: JobPaginationTab;

  public static getJobs(data: JobPagination, tab: FindJobTabEnum): JobOverview[] {
    return data[tab].jobs || [];
  }

  public static setActiveJobs(data: JobPagination, newJobList: JobOverview[]): void {
    data[data.activeTab].jobs = newJobList;
  }
}

export class WindowPosition {
  x: number;
  y: number;

  static reset(data: WindowPosition): void {
    data.x = 0;
    data.y = 0;
  }

  static set(data: WindowPosition, x: number, y: number): void {
    data.x = x;
    data.y = y;
  }

  constructor() {}
}

export interface JobViewResolver {
  profileNames: BusinessAndPersonalNames;
  job: Job;
}

export interface JobDetailsForModal {
  amount: string;
  date: string;
  shooterName: string;
}

export class JobReport {
  star: StarsEnum;

  constructor(public review = '') {}
}

export enum StarsEnum {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

// For client side only
export interface CompleteJobModalData {
  review: string;
  rate: number;
  result: boolean;
}

// For label types, only for client side
export enum LabelTypeEnum {
  DEFAULT = 'DEFAULT',
  EXPIRING = 'EXPIRING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DONE = 'DONE',
  DECLINED = 'DECLINED',
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  radius: string;
}

export interface PreExpireJobData {
  id: string;
  title: string;
}

export class PurchaseMembershipModalData {
  constructor(
      public headerText = '',
      public subheaderText = '',
      public subscriptionsType?: SubscriptionTypeEnum[]
  ) {}
}
