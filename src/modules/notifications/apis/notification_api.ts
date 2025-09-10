import rootAPI from "../../../redux/api/rootAPI";
import { deleteNotificationRoute, getNotificationsRoute } from "../../../redux/api/api_route";
import INotificationDetails from "../models/notification_model";


const notificationsApi = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
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
    useLazyGetNotificationsQuery,
    useDeleteNotificationMutation,
} = notificationsApi;

export default notificationsApi;