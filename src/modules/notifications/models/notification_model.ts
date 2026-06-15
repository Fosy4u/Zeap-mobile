import type { INotificationPayload } from "../utils/notificationNavigation";

interface INotificationDetails {
  _id: string;
  notifications: INotification[];
}

interface INotification {
  _id: string;
  title: string;
  body: string;
  image?: string;
  createdAt: string;
  data?: INotificationPayload;
}

export type { INotification };
export default INotificationDetails;