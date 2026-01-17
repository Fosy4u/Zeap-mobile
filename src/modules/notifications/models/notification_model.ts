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
}

export type { INotification };
export default INotificationDetails;