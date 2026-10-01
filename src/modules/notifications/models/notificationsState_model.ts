import { INotification } from "./notification_model";

interface INotificationsState {
    notifications: INotification[];

    markedAllRead: boolean;

    loadingMessage: string,
    isLoading: boolean;
}

export default INotificationsState;