import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useLazyGetNotificationsQuery } from '../apis/notification_api';
import { setNotifications } from '../slices/notifications_slice';
import { filterNotificationsForUser } from '../utils/notificationRelevance';

/* How often to look for new notifications while the app is in the foreground.
   Short enough to feel live, long enough not to be a battery/data drain. */
const POLL_INTERVAL_MS = 60_000;

const NotificationSyncComponent = () => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    const [getNotifications] = useLazyGetNotificationsQuery();

    // Guests have no notification feed, so don't poll an endpoint that will 401.
    const isSignedIn = !!userData?.uid && !userData?.isGuest;

    /* Held in a ref so the interval and the AppState listener always call the
       latest version without needing to be torn down and re-armed. */
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
