interface INotificationsState {
    notifications: INotification[];
}

interface INotification {
    id: string;
    title: string;
    description: string;
    date: string;
    type: string;
    status: string;
}