import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: INotificationsState = {
    notifications: [
        {
            id: "1",
            title: "New order placed",
            description: "Your order has been confirmed and will be delivered between 04-Jul-2024 and 10-Jul-2024.",
            date: "20 Aug, 2022",
            type: "Order",
            status: "Success",
        },
        {
            id: "2",
            title: "Payment completed",
            description: "You have successfully completed payment for your Louis Vuitton Men’s 3piece Suit.",
            date: "20 Aug, 2022",
            type: "Payment",
            status: "Success",
        },
        {
            id: "3",
            title: "Package dispatched",
            description: "Your order has been dispatched and is on route to your location. Our delivery agent will call you.",
            date: "20 Aug, 2022",
            type: "Dispatch",
            status: "Success",
        },
    ],
};

export const notificationsSlice = createSlice({
    name: "notificationsSlice",
    initialState,
    reducers: {
        setNotifications: (state: INotificationsState, action: PayloadAction<INotification[]>) => {
            state.notifications = action.payload;
        },
    },
});


const { actions, reducer } = notificationsSlice;
export const { setNotifications } = actions;
export default reducer;