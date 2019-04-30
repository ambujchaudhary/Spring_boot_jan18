import { UserStatus } from '../auth/auth.model';
import { ExperienceEnum, Location, UploadedFile, WorkerRoleEnum } from '../user/user.model';

export interface PublicUserProfileData {
  address: string;
  firstName: string;
  lastName: string;
  businessName: string;
  certificate: string;
  equipment: string[];
  images: UploadedFile[];
  profilePhoto: string;
  publicBio: string;
  resources: string[];
  roles: string[];
  videos: string[];
  experience: string;
  averageFeedback: number;
  feedbackQuantity: number;
  currentUser: boolean;
  adminsComment: string;
}

export interface PrivateUserProfileData {
  address: string;
  firstName: string;
  lastName: string;
  businessName: string;
  certificate: string;
  equipment: string[];
  images: UploadedFile[];
  profilePhoto: string;
  publicBio: string;
  resources: string[];
  roles: string[];
  videos: string[];
  experience: string;
  averageFeedback: number;
  status: UserStatus;
  blocked: boolean;
  feedbackQuantity: number;
  webAddress: string;
  gst: boolean;
  businessAddress: string;
  abn: string;
}

export interface AdminDeclineFeedbackData {
  comment: string;
  id: number;
}

export interface AdminJobData {
  amount: string;
  id: string;
  ownerFullName: string;
  date: string;
  ownerId: string;
  shooterFullName: string;
  shooterId: string;
  title: string;
}

export interface AdminJobsManagementInfo {
  closed: AdminJobData[];
  closedCounter: string;
  pending: AdminJobData[];
  pendingCounter: string;
  all: AdminJobData[];
  allCounter: string;
}

export interface AdminUserData {
  address: string | null;
  id: number | string;
  fullName: string;
  joined: string | null;
  ownerId?: string;
  roles: WorkerRoleEnum[] | null;
  status: UserStatus;
  statusLabel?: string;
}

export interface AdminUserManagementInfo {
  approved: AdminUserData[];
  approvedCounter: number | string;
  pending: AdminUserData[];
  pendingCounter: number | string;
  blocked: AdminUserData[];
  blockedCounter: number | string;
  new: AdminUserData[];
  newCounter: number | string;
}

// only for client side
export enum UserTableTabsEnum {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  NEW = 'NEW',
}

export class UserProfileForEditData {
  firstName: string;
  lastName: string;
  businessName: string;
  profilePhoto: UploadedFile;
  videos?: string[];
  profileLocation: Location;
  businessLocation: Location;
  experience: ExperienceEnum;
  certificate?: UploadedFile | string;
  publicBio: string;
  images?: UploadedFile[];
  resources?: string[];
  roles: string[];
  equipment?: string[];
  abn: string;
  gst: boolean;
  webAddress: string;

  //  only for client side
  isDroneOperatorLicense?: boolean;

  public static removeClientSideData(data: UserProfileForEditData) {
    delete data.isDroneOperatorLicense;
  }
}

export class EditedProfileData {
  constructor(
      public userProfileData = new EditedUserProfileData(),
      public businessProfileData = new EditedBusinessProfileData(),
  ) {}
}

export class EditedUserProfileData {
  profilePhoto: UploadedFile;
  videos?: string[];
  location: Location;
  experience: ExperienceEnum;
  certificate?: UploadedFile | string;
  publicBio: string;
  images?: UploadedFile[];
  resources?: string[];
  roles: string[];
  equipment?: string[];
}

export class EditedBusinessProfileData {
  businessName: string;
  location: Location;
  abn: string;
  gst: boolean;
  webAddress: string;
}

export enum GoogleAutoCompleteTypeEnum {
  PROFILE_LOCATION = 'PROFILE_LOCATION',
  BUSINESS_LOCATION = 'BUSINESS_LOCATION',
}

export class Report {
  constructor(
      public applicants = 0,
      public jobs = 0,
      public users = 0
  ) {}
}

export class ReportPayloadData {
  constructor(
      public date = '',
      public type: AdminDatepickerModelEnum
  ) {}
}

export enum AdminDatepickerModelEnum {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export interface DownloadUrl {
  url: string;
}
