export interface WeatherForecast {
  address: string;
  forecast: ForecastInfo;

}

export interface ForecastInfo {
  forecastDate: string;
  icon: WeatherStatusEnum;
  temperature: number;
}

export enum WeatherStatusEnum {
  CLEAR_DAY = 'CLEAR_DAY',
  CLEAR_NIGHT = 'CLEAR_NIGHT',
  RAIN = 'RAIN',
  SNOW = 'SNOW',
  SLEET = 'SLEET',
  WIND = 'WIND',
  FOG = 'FOG',
  CLOUDY = 'CLOUDY',
  PARTLY_CLOUDY_DAY = 'PARTLY_CLOUDY_DAY',
  PARTLY_CLOUDY_NIGHT = 'PARTLY_CLOUDY_NIGHT',
}

export enum DashboardStatisticsTypeEnum {
  BE_CREW = 'BE_CREW',
  FIND_CREW = 'FIND_CREW',
}

export interface Statistics {
  activeJobs: number;
  myApplications: number;
  pendingJobs: number;
  totalApplicants: number;
}
