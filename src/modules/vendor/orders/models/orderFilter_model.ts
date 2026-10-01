import IOrder from "./oder_model";
import { canCancelOrderAtStatus, NON_CANCELLABLE_STATUSES, IOrderLifecycleStatus } from "../../../../utils/orderLifecycle";

interface IVendorOrderFilter {
    status?:    string[];
    itemName?:  string;
    orderId?:   string;
    fromDate?:  string;
    toDate?:    string;
};

const EMPTY_ORDER_FILTER: IVendorOrderFilter = {
    status: [],
    itemName: "",
    orderId: "",
    fromDate: "",
    toDate: "",
};

const VENDOR_ORDER_STATUSES = [
    "Placed",
    "Confirmed",
    "Processing",
    "Ready",
    "Dispatched",
    "Delivered",
    "Cancelled",
] as const;

const titleCaseStatus = (value: string): string =>
    value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;

const buildStatusOptions = (orders?: IOrder[]): string[] => {
    const options = [...VENDOR_ORDER_STATUSES] as string[];
    const seen = new Set(options.map((option) => option.toLowerCase()));

    (orders ?? []).forEach((order) => {
        const name = order.status?.name?.trim();
        if (!name || seen.has(name.toLowerCase())) { return; }
        seen.add(name.toLowerCase());
        options.push(titleCaseStatus(name));
    });

    return options;
};

const canRejectOrderStatus = (status?: IOrderLifecycleStatus): boolean =>
    canCancelOrderAtStatus(status, true);

// An order matches a chip when its name equals it or its value phrase contains it.
const statusMatches = (order: IOrder, statusName: string): boolean => {
    const wanted = statusName.trim().toLowerCase();
    if (!wanted) { return true; }
    const name = order.status?.name?.toLowerCase() ?? "";
    const value = order.status?.value?.toLowerCase() ?? "";
    return name === wanted || value.includes(wanted);
};

const hasActiveOrderFilter = (filter?: IVendorOrderFilter): boolean =>
    !!filter && (
        (filter.status?.length ?? 0) > 0 ||
        !!filter.itemName?.trim() ||
        !!filter.orderId?.trim() ||
        !!filter.fromDate ||
        !!filter.toDate
    );

export {
    NON_CANCELLABLE_STATUSES,
    EMPTY_ORDER_FILTER,
    VENDOR_ORDER_STATUSES,
    buildStatusOptions,
    canRejectOrderStatus,
    statusMatches,
    titleCaseStatus,
    hasActiveOrderFilter,
};
export default IVendorOrderFilter;
