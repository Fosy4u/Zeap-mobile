import navigate from "../../../routes/pushNavigation";

export interface INotificationPayload {
    notificationType?: string;
    orderId?: string;
    productOrder_id?: string;
    itemNo?: string | number;
    roleType?: string;
    code?: string;
    shopId?: string;
    reference?: string;
}

// Shared navigation handler — used both by FCM (push tap / foreground) and by
// the in-app notifications list tap. Keeping a single implementation prevents
// the two surfaces from drifting on route names or payload shape.
const handleNotificationNavigation = (data?: INotificationPayload | null) => {
    if (!data) return;

    const itemNumber = data.itemNo !== undefined && data.itemNo !== null
        ? parseInt(String(data.itemNo), 10)
        : undefined;

    if (data.notificationType === "order" && (data.orderId || data.productOrder_id)) {
        if (data.roleType === "vendor") {
            navigate("vendorOrderDetailsScreen", {
                screen: "Orders",
                from: "Notification Screen",
                orderId: data.productOrder_id,
                itemNumber,
            });
        } else {
            navigate("orderDetailsScreen", {
                from: "Notification Screen",
                orderId: data.orderId,
                itemNumber,
            });
        }
        return;
    }

    if (data.notificationType === "voucher" && data.code) {
        navigate("pointAndVoucherScreen", {
            from: "Notification Screen",
            code: data.code,
        });
        return;
    }

    if (data.notificationType === "shop" && data.shopId) {
        navigate("vendorHomeScreen", {
            screen: "Dashboard",
            shopId: data.shopId,
        });
        return;
    }

    if (data.notificationType === "payments" && data.reference) {
        navigate("paymentScreen");
    }
};

export default handleNotificationNavigation;
