export interface Country {
  code: string;
  label: string;
  icon: string;
}

export type ChooseCountryStep = 0 | 1 | 2;

export class Subscribers {
  country: string;
  email: string;
  firstName: string;
  lastName: string;
}
