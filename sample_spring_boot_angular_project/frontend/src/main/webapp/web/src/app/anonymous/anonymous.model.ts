export class LoginCredential {
  static resetData(data: LoginCredential) {
    data.email = '';
    data.password = '';
  }

  constructor(public email = '', public password = '') {
  }
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  emailSocial?: string;
}

export class SignUpWithSocialFormData {
  email?: string;
}

export interface ForgetPasswordFormData {
  email: string;
}

export interface ChangePasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

export enum RegisterTypes {
  DEFAULT = 'DEFAULT',
  SOCIAL = 'social',
  SOCIAL_WITHOUT_EMAIL = 'email',
  CHARGEBEE = 'chargebee',
}

export enum RegisterSteps {
  USER_DATA = 'USER_DATA',
  USER_EMAIL = 'USER_EMAIL',
  TERMS_AND_POLICY = 'TERMS_AND_POLICY',
  SELECT_MEMBERSHIP = 'SELECT_MEMBERSHIP',
}

export class ChargbeeSubscriptionData {
  constructor(public hostedPageId = '') {}
}

export class Model {

  constructor(object?) {
    Object.assign(this, object);
  }

}

export class SocialUser extends Model {
  token: string;
  email?: string;
}

export class FacebookUser extends Model {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class GoogleUser extends Model {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export enum MembershipTypeEnum {
  FREE = 'free',
  MONTHLY = 'monthly',
  ANNUAL = 'shootzu-annual-membership',
}
