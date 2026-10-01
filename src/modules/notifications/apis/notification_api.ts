import rootAPI from "../../../redux/api/rootAPI";
import { deleteNotificationRoute, getNotificationsRoute, markNotificationAsReadRoute, markNotificationAsSeenRoute, registerFCMToken } from "../../../redux/api/api_route";
import INotificationDetails from "../models/notification_model";


const notificationsApi = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        
        // Register FCM Token
        registerFCMToken: builder.mutation<any, { pushToken: string }>({
            query: ({ pushToken }) => ({
                url: registerFCMToken,
                method: "POST",
                body: { pushToken }
            }),
            invalidatesTags: [],
            transformResponse(response: any) {
                return response;
            }
        }),

        // Get Notifications
        getNotifications: builder.query<INotificationDetails, void>({
            query: () => ({
                url: getNotificationsRoute,
                method: "GET",
            }),
            providesTags: ["notifications"],
            transformResponse(response: { data: INotificationDetails }) {
                return response.data;
            }
        }),

        // Mark all notifications as read (clears the unread bell badge).
        markNotificationsAsRead: builder.mutation<any, void>({
            query: () => ({
                url: markNotificationAsReadRoute,
                method: "PUT",
            }),
            invalidatesTags: ["notifications"],
            transformResponse(response: any) {
                return response;
            }
        }),

        // Mark specific notifications as seen (persists read-state per item).
        markNotificationAsSeen: builder.mutation<any, { notification_ids: string[] }>({
            query: (requestData) => ({
                url: markNotificationAsSeenRoute,
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: [],
            transformResponse(response: any) {
                return response;
            }
        }),

        // Delete Notification
        deleteNotification: builder.mutation<INotificationDetails, { notification_id: string }>({
            query: (requestData) => ({
                url: deleteNotificationRoute,
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["notifications"],
            transformResponse: (response: { data: INotificationDetails }) => {
                return response.data;
            }
        }),
    }),
});

export const {
    useRegisterFCMTokenMutation,
    useLazyGetNotificationsQuery,
    useMarkNotificationsAsReadMutation,
    useMarkNotificationAsSeenMutation,
    useDeleteNotificationMutation,
} = notificationsApi;

export default notificationsApi;