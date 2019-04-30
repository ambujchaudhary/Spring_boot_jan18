export class NotificationsConfig {
  public static size = 25;
  public static page = 0;
}

export class Notification {
  id: string;
  title: string;
  message: string;
  eventDate: string;
  receiver?: string;
  hidden: boolean;
}

export class NotificationPaginationOptions {
  size: number;
  page: number;
}

export interface NotificationMessage {
  isUrl: boolean;
  text: string;
  url?: string;
  textBefore?: string;
}
