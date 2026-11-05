import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useLazyGetNotificationsQuery } from '../apis/notification_api';
import { setNotifications } from '../slices/notifications_slice';
import { filterNotificationsForUser } from '../utils/notificationRelevance';

const POLL_INTERVAL_MS = 60_000;

const NotificationSyncComponent = () => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    const [getNotifications] = useLazyGetNotificationsQuery();

    const isSignedIn = !!userData?.uid && !userData?.isGuest;

    const syncRef = useRef<() => void>(() => {});

    syncRef.current = () => {
        if (!isSignedIn) { return; }
        getNotifications()
            .unwrap()
            .then((response) => {
                if (response?.notifications) {
                    dispatch(setNotifications(
                        filterNotificationsForUser(response.notifications, userData),
                    ));
                }
            })
            .catch(() => {
                // Silent: a failed background poll must never surface an error.
            });
    };

    useEffect(() => {
        if (!isSignedIn) { return; }

        syncRef.current();
        const interval = setInterval(() => syncRef.current(), POLL_INTERVAL_MS);

        const onAppStateChange = (nextState: AppStateStatus) => {
            if (nextState === "active") { syncRef.current(); }
        };
        const subscription = AppState.addEventListener("change", onAppStateChange);

        return () => {
            clearInterval(interval);
            subscription.remove();
        };
    }, [isSignedIn]);

    return null;
};

export default NotificationSyncComponent;
