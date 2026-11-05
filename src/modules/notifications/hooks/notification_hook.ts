import { useDispatch, useSelector } from "react-redux";
import { useDeleteNotificationMutation, useLazyGetNotificationsQuery, useMarkNotificationAsSeenMutation } from "../apis/notification_api";
import { markAllNotificationsRead, markNotificationsSeen, setIsLoading, setLoadingMessage, setNotifications } from "../slices/notifications_slice";
import handleError from "../../general/hooks/errorHandler_hook";
import { useEffect } from "react";
import { RootState } from "../../../redux/store/store";
import { filterNotificationsForUser } from "../utils/notificationRelevance";


const useNotificationHook = () => {
    const { notifications } = useSelector((state: RootState) => state.notificationsState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    // Call APIs
    const [getNotifications] = useLazyGetNotificationsQuery();
    const [markNotificationAsSeen] = useMarkNotificationAsSeenMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    // Handle get notifications
    const handleGetNotifications = async () => {
        dispatch(setLoadingMessage("Loading notifications..."));
        dispatch(setIsLoading(true));
        
        try {
            const notificationsResponse = await getNotifications().unwrap();
            // console.log("NOTIFICATIONS::: ", notificationsResponse);

            if (notificationsResponse) {
                dispatch(setNotifications(
                    filterNotificationsForUser(notificationsResponse.notifications, userData),
                ));
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

        try {
            const deleteNotificationResponse = await deleteNotification(requestData).unwrap();

            if (deleteNotificationResponse) {
                dispatch(setNotifications(
                    filterNotificationsForUser(deleteNotificationResponse.notifications, userData),
                ));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    }; 

    const handleMarkAllAsRead = async () => {
        const unseenIds = notifications
            .filter((notification) => notification?.seen !== true)
            .map((notification) => notification._id)
            .filter(Boolean);

        dispatch(markAllNotificationsRead());

        if (unseenIds.length === 0) return;
        try {
            await markNotificationAsSeen({ notification_ids: unseenIds }).unwrap();
        } catch (error) {
        }
    };

    const handleMarkNotificationAsSeen = (notification_id: string) => {
        if (!notification_id) return;
        dispatch(markNotificationsSeen([notification_id]));
        markNotificationAsSeen({ notification_ids: [notification_id] })
            .unwrap()
            .catch(() => {
            });
    };

    useEffect(() => {
        handleGetNotifications();
    }, []);

    return {
        handleDeleteNotification,
        handleMarkAllAsRead,
        handleMarkNotificationAsSeen,
    };
};

export default useNotificationHook;