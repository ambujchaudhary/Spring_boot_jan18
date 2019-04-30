export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  ANONYMOUS = 'ROLE_ANONYMOUS',
  USER = 'ROLE_USER',
}

export enum UserStatus {
  FACEBOOK_NO_EMAIL = 'FACEBOOK_NO_EMAIL',
  SOCIAL_SIGN_UP = 'SOCIAL_SIGN_UP',
  PENDING = 'PENDING',
  NO_BUSINESS = 'NO_BUSINESS',
  NEW = 'NEW',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
  ENABLED = 'ENABLED',
  CHARGEBEE_SIGN_UP = 'CHARGEBEE_SIGN_UP',
  EDITED = 'EDITED',
}

export interface User {
  address: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  logo?: string;
  social: boolean;
}

export interface Token {
  token: string;
}

export interface BusinessAndPersonalNames {
  businessName: string;
  personalName: string;
}
