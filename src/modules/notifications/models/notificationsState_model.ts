import { INotification } from "./notification_model";

interface INotificationsState {
    notifications: INotification[];

    loadingMessage: string,
    isLoading: boolean;
}

export default INotificationsState;