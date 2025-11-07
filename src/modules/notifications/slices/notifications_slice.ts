import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import INotificationsState from "../models/notificationsState_model";
import { INotification } from "../models/notification_model";

const initialState: INotificationsState = {
    notifications: [],

    loadingMessage: "",
    isLoading: false,
};

export const notificationsSlice = createSlice({
    name: "notificationsSlice",
    initialState,
    reducers: {
        setNotifications: (state: INotificationsState, action: PayloadAction<INotification[]>) => {
            state.notifications = action.payload;
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
    setLoadingMessage,
    setIsLoading
} = actions;
export default reducer;