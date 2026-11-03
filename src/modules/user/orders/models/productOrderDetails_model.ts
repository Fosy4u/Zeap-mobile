interface IDateRange {
    min?: string;
    max?: string;
};

interface IProductOrderImage {
    link?: string;
    name?: string;
    _id?: string;
};

interface IProductOrderAmount {
    currency?: string;
    value?: number;
    _id?: string;
};

interface IProductOrderStatus {
    name?: string;
    value?: string;
    percentage?: number;
    date?: string;
};

interface IProductOrderPricing {
    unitPrice?: number;
    basePrice?: number;
    discountApplied?: number;
    pricingSource?: string;
};

interface IProductOrderDeliveryDetails {
    address?: string;
    region?: string;
    country?: string;
    postCode?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    deliveryNote?: string;
    _id?: string;
};

interface IProductOrderShop {
    _id?: string;
    shopId?: string;
    shopName?: string;
    email?: string;
    phoneNumber?: string;
    region?: string;
    country?: string;
};

interface IProductOrderProduct {
    _id?: string;
    productId?: string;
    productType?: string;
    title?: string;
    status?: string;
    description?: string;
    sizes?: string[];
    sizeStandard?: string;
    colors?: { value?: string; images?: IProductOrderImage[] }[];
};

interface IProductOrderParent {
    _id?: string;
    orderId?: string;
    gainedPoints?: number;
    storeLocation?: string;
    deliveryDetails?: IProductOrderDeliveryDetails;
    createdAt?: string;
    updatedAt?: string;
};

interface IProductOrderDetails {
    _id?: string;
    orderId?: string;
    itemNo?: number;
    order?: IProductOrderParent;
    shop?: IProductOrderShop;
    product?: IProductOrderProduct;
    channel?: string;
    quantity?: number;
    sku?: string;
    size?: string;
    color?: string;
    images?: IProductOrderImage[];
    bodyMeasurements?: any[];
    status?: IProductOrderStatus;
    amount?: IProductOrderAmount[];
    pricing?: IProductOrderPricing;
    expectedVendorCompletionDate?: IDateRange;
    expectedBuyerCompletionDate?: IDateRange;
    expectedDeliveryDate?: IDateRange;
    deliveryMethod?: string;
    deliveryDetails?: IProductOrderDeliveryDetails;
    cancel?: { isCancelled?: boolean; cancelledBy?: string };
    createdAt?: string;
    updatedAt?: string;
};

export type {
    IDateRange,
    IProductOrderAmount,
    IProductOrderDeliveryDetails,
    IProductOrderImage,
    IProductOrderPricing,
    IProductOrderProduct,
    IProductOrderShop,
    IProductOrderStatus,
};
export default IProductOrderDetails;
