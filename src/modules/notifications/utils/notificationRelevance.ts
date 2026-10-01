import type { IUser } from "../../profile/models/profileState_model";
import type { INotification } from "../models/notification_model";
import type { INotificationPayload } from "./notificationNavigation";

type NotificationAudience = Pick<IUser, "isVendor" | "shopId"> | null | undefined;

const isNotificationForUser = (
    data: INotificationPayload | null | undefined,
    user: NotificationAudience,
): boolean => {
    // No metadata at all — a general/system message from the admin.
    if (!data) { return true; }

    const roleType = String(data.roleType ?? "").trim().toLowerCase();

    if (roleType === "vendor") {
        if (!user?.isVendor) { return false; }
        if (data.shopId && user?.shopId && data.shopId !== user.shopId) { return false; }
    }

    // Shop notifications name the shop they concern, whatever the role.
    if (data.notificationType === "shop" && data.shopId && user?.shopId && data.shopId !== user.shopId) {
        return false;
    }

    return true;
};

const filterNotificationsForUser = (
    notifications: INotification[] | null | undefined,
    user: NotificationAudience,
): INotification[] =>
    (notifications ?? []).filter((notification) => isNotificationForUser(notification?.data, user));

export { isNotificationForUser, filterNotificationsForUser };
