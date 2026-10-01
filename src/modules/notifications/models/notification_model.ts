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
  // Read-state flag from /notification/inbox. Drives the unread badge on the
  // bell icon (count of notifications where seen !== true).
  seen?: boolean;
  createdAt: string;
  data?: INotificationPayload;
}

export type { INotification };
export default INotificationDetails;