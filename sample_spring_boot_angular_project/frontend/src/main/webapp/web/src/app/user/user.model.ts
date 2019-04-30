import { OwnerNameEnum, PreExpireJobData } from './job/job.model';

export const userRoutingPaths = {
  businessProfile: 'business-profile',
  userProfile: 'profile',
  userProfilePending: 'profile/pending',
};

export class Location {
  address: string;
  lng: number;
  lat: number;
}

export class Coordinate {
  lng: number;
  lat: number;
}

export enum WorkerRoleEnum {
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  VIDEOGRAPHER = 'VIDEOGRAPHER',
  DRONE_OPERATOR = 'DRONE_OPERATOR',
  PHOTO_EDITOR = 'PHOTO_EDITOR',
  VIDEO_EDITOR = 'VIDEO_EDITOR',
  ASSISTANT = 'ASSISTANT',
}

export enum ExperienceEnum {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  SOLID = 'SOLID',
  ADVANCE = 'ADVANCE',
  MASTER = 'MASTER',
}

export enum ExperienceLabelEnum {
  BEGINNER = '0-1 Year',
  INTERMEDIATE = '1-2 Years',
  SOLID = '2-5 Years',
  ADVANCE = '5-10 Years',
  MASTER = '10+ Years',
}

export interface Experience {
  key: ExperienceEnum;
  label: ExperienceLabelEnum;
}

export class UploadFileResponse {
  constructor(public fullName = '',
              public originalName = '',
              public size200 = '',
              public logo = '',
              public url = '') {
  }
}

export class UserProfile {
  profilePhoto?: string;
  videos?: string[];
  location: Location;
  experience: ExperienceEnum;
  certificate?: string | UploadedFile;
  publicBio: string;
  images?: string[] | UploadedFile[];
  resources?: string[];
  adminsComment?: string;

  // only for client side
  isDroneOperatorLicense?: boolean;

  public static removeClientSideData(data: UserProfile) {
    delete data.isDroneOperatorLicense;
  }

  constructor(public roles: WorkerRoleEnum[] = [],
              public equipment: string[] = []) {
  }
}

export class UploadedFile {
  fullName: string;
  originalName: string;
  url: string;
  size200?: string;
  logo?: string;

  // only for client side
  errorMessage?: string;
  isInvalid = false;
  isLoading = false;

  public static resetData(data: UploadedFile) {
    data.fullName = '';
    data.originalName = '';
    data.url = '';

    data.errorMessage = '';
    data.isInvalid = false;
    data.isLoading = false;
  }

  public static setClientSideData(data: UploadedFile) {
    data.errorMessage = '';
    data.isInvalid = false;
    data.isLoading = false;
  }

  public static addError(data: UploadedFile, errorMessage = ''): UploadedFile {
    data.errorMessage = errorMessage;
    data.isInvalid = true;
    data.isLoading = false;

    return data;
  }
}

export enum UploadedFileType {
  IMAGE = 'IMAGE',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  CERTIFICATE = 'CERTIFICATE',
}

export enum UploadedFileServiceMethod {
  UPLOAD_IMAGE = 'uploadImage',
  UPLOAD_CERTIFICATE = 'uploadCertificate',
  UPLOAD_PROFILE_PHOTO = 'uploadProfilePhoto',
}

export class UploadedFileSaveOptions {
  serviceMethod: UploadedFileServiceMethod;
  acceptedExtension: string;
  extensionErrorMessage: string;
  sizeErrorMessage: string;
}

export class BusinessProfileData {
  businessName: string;
  abn: string;
  location: Location;
  webAddress: string;
  gst: boolean;
}

export interface UserNames {
  userName: string;
  businessName: string;
}

export interface FeedbackData {
  authorFullName: string;
  mark: number;
  review: string;
  reviewDate: string;
  id: number;
  ownerType: OwnerNameEnum;
}

export class FeedbackConfig {
  public static size = 3;
  public static page = 0;
}

export class FeedbackPaginationOptions {
  page: number;
  size: number;
}

export interface JobDataForFeedback {
  amount: string;
  date: string;
  fullName: string;
  id: string;
  title: string;
}

export type LoginModalsData = [Array<JobDataForFeedback>, Array<PreExpireJobData>, Array<JobDataForFeedback>];

export class ChangePasswordData {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
}

// only for client side
export enum ChangePasswordTextVisibilityEnum {
  OLD = 'old',
  NEW = 'new',
  CONFIRM = 'confirm'
}

export class DeviceInfo {
  constructor(
      public userId: string,
      public token: string
  ) {}
}

export interface ProfileId {
  profileId: string;
}
