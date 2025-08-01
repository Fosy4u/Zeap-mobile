import { useDispatch } from "react-redux";
import { useDeleteNotificationMutation, useLazyGetNotificationsQuery } from "../apis/notification_api";
import { setIsLoading, setLoadingMessage, setNotifications } from "../slices/notifications_slice";
import handleError from "../../general/hooks/errorHandler_hook";
import { useEffect } from "react";


const useNotificationHook = () => {
    const dispatch = useDispatch();

    // Call APIs
    const [getNotifications] = useLazyGetNotificationsQuery();
    const [deleteNotification] = useDeleteNotificationMutation();

    // Handle get notifications
    const handleGetNotifications = async () => {
        dispatch(setLoadingMessage("Loading notifications..."));
        dispatch(setIsLoading(true));
        
        try {
            const notificationsResponse = await getNotifications().unwrap();
            // console.log("NOTIFICATIONS::: ", notificationsResponse);

            if (notificationsResponse) {
                const notifications = notificationsResponse.notifications;
                dispatch(setNotifications(notifications));
            }

        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle delete notification
    const handleDeleteNotification = async (notification_id: string) => {
        dispatch(setLoadingMessage("Deleting notification..."));
        dispatch(setIsLoading(true));

        const requestData = {
            notification_id
        }
        console.log("NOTIFICATION ID::: ", notification_id);
        
        
        try {
            const deleteNotificationResponse = await deleteNotification(requestData).unwrap();
            console.log("DELETE NOTIFICATION RESPONSE::: ", deleteNotificationResponse);

            if (deleteNotificationResponse) {
                const notifications = deleteNotificationResponse.notifications;
                dispatch(setNotifications(notifications));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    }; 

    useEffect(() => {
        handleGetNotifications();
    }, []);

    return {
        handleDeleteNotification,
    };
};

export default useNotificationHook;