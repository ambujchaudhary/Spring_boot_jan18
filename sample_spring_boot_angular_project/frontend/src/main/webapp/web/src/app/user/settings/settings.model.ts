// TODO
export enum SubscriptionStatusEnum {
  ACTIVE = 'ACTIVE',
  NON_RENEWING = 'NON_RENEWING',
  CANCELLED = 'CANCELLED',
  FUTURE = 'FUTURE'
}

export enum SubscriptionTypeEnum {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

export class SubscriptionType {
  constructor(
      public subscriptionType: SubscriptionTypeEnum
  ) {}
}

export class Subscriptions {
  constructor(
      public dateFrom: string | null,
      public dateTo: string | null,
      public subscriptionType: SubscriptionTypeEnum,
      public subscriptionStatus: SubscriptionStatusEnum,
      public applications: number,
      public jobs: number
  ) {
  }
}
