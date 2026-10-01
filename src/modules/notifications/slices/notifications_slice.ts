import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import INotificationsState from "../models/notificationsState_model";
import { INotification } from "../models/notification_model";

const initialState: INotificationsState = {
    notifications: [],
    markedAllRead: false,

    loadingMessage: "",
    // Start in the loading state so the inbox shows its skeleton on first open
    // (until the first fetch resolves) instead of flashing "No notification".
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

        /* Clear the unread badge: flip everything currently held to seen:true
           and remember it for the session. */
        markAllNotificationsRead: (state: INotificationsState) => {
            state.markedAllRead = true;
            state.notifications = state.notifications.map((notification) => ({ ...notification, seen: true }));
        },

        /* Optimistically flip specific notifications to seen:true (fired on tap,
           before the server call resolves). */
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