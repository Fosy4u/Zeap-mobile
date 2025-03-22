interface IAnalytic {
    productSold?:                 number;
    ordersCountByStatus?:         OrdersCountByStatus;
    productGroupsCount?:          ProductGroupsCount;
    shopRevenuesByPaymentStatus?: ShopRevenuesByPaymentStatus;
}

interface OrdersCountByStatus {
    placed?:     number;
    confirmed?:  number;
    processing?: number;
    ready?:      number;
    dispatched?: number;
    delivered?:  number;
    cancelled?:  number;
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