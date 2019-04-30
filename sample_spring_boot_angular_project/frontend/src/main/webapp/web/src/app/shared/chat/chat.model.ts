import { WorkerRoleEnum } from '../../user/user.model';

export enum MessageStatusEnum {
  READ = 'READ',
  UNREAD = 'UNREAD'
}

export class ChatMember {
  userId: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  count?: string[];
}

export class ChatJob {
  id: string;
  title: string;
  workerRoles: WorkerRoleEnum[];

  //  only for client side
  count?: number;
}

export interface ChatDialogMessage {
  id: string;
  text: string;
  sentDate: string;
  date: string;
  status: MessageStatusEnum;
  mine: boolean;
}

export class ChatDialogMessageMataData {
  [s: string]: ChatDialogMessage[];
}

export class ChatMessage {
  id: string;
  text: string;
  chatId?: string;
  sentDate: string;
  chatJobDTO: ChatJob;
  status: MessageStatusEnum;
  sender: ChatMember;
  recipient: ChatMember;
}

export class ChatRecipientsMataData {
  [s: number]: ChatMember[];
}

export interface ChatMataData {
  jobs: ChatJob[];
  recipients: ChatRecipientsMataData;
  dialogs: ChatDialogMessageMataData;
}

export class ChatNewMessage {
  constructor(
      public jobId: string,
      public recipient: string,
      public sender: string,
      public text: string
  ) {}
}
