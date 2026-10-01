import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const NotificationBadgeComponent = () => {
    const { notifications } = useSelector((state: RootState) => state.notificationsState);
    const unread = notifications.filter((notification) => notification?.seen !== true).length;

    if (unread === 0) { return null; }

    return (
        <View
            className="absolute -top-1 -right-1 px-1 items-center justify-center rounded-full bg-red-500"
            style={{ minWidth: 18, height: 18 }}
        >
            <Text className="font-montserratSemiBold text-[10px] text-white">
                { unread > 9 ? "9+" : unread }
            </Text>
        </View>
    );
};

export default NotificationBadgeComponent;
