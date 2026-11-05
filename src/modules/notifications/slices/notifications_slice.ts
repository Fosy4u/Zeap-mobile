import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import INotificationsState from "../models/notificationsState_model";
import { INotification } from "../models/notification_model";

const initialState: INotificationsState = {
    notifications: [],
    markedAllRead: false,

    loadingMessage: "",
    isLoading: true,
};

export const notificationsSlice = createSlice({
    name: "notificationsSlice",
    initialState,
    reducers: {
        setNotifications: (state: INotificationsState, action: PayloadAction<INotification[]>) => {
            state.notifications = state.markedAllRead
                ? action.payload.map((notification) => ({ ...notification, seen: true }))
                : action.payload;
        },

        markAllNotificationsRead: (state: INotificationsState) => {
            state.markedAllRead = true;
            state.notifications = state.notifications.map((notification) => ({ ...notification, seen: true }));
        },

        markNotificationsSeen: (state: INotificationsState, action: PayloadAction<string[]>) => {
            state.notifications = state.notifications.map((notification) => (
                action.payload.includes(notification._id)
                    ? { ...notification, seen: true }
                    : notification
            ));
        },

        setLoadingMessage: (state: INotificationsState, action: PayloadAction<string>) => {
            state.loadingMessage = action.payload;
        },

        setIsLoading: (state: INotificationsState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

const { actions, reducer } = notificationsSlice;
export const {
    setNotifications,
    markAllNotificationsRead,
    markNotificationsSeen,
    setLoadingMessage,
    setIsLoading
} = actions;
export default reducer;