interface IAnalytic {
    productSold?:                 number;
    ordersCountByStatus?:         OrdersCountByStatus;
    productGroupsCount?:          ProductGroupsCount;
    shopRevenuesByPaymentStatus?: ShopRevenuesByPaymentStatus;
}

/* Keys mirror the API's order statuses verbatim — two of them are spaced
   phrases, not camelCase. */
interface OrdersCountByStatus {
    placed?:                 number;
    confirmed?:              number;
    processing?:             number;
    "quality check"?:        number;
    "ready for delivery"?:   number;
    dispatched?:             number;
    delivered?:              number;
    cancelled?:              number;
}

interface ProductGroupsCount {
    "Ready-Made"?: number;
    Bespoke?:      number;
}

interface ShopRevenuesByPaymentStatus {
    pending?: Paid;
    paid?:    Paid;
}

interface Paid {
    currency?: string;
    value?:    number;
}

export type { OrdersCountByStatus, ProductGroupsCount, ShopRevenuesByPaymentStatus };
export default IAnalytic;