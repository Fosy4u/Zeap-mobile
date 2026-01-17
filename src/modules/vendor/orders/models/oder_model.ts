interface IOrder {
    _id?:                          string;
    order?:                        string;
    disabled?:                     boolean;
    orderId?:                      string;
    itemNo?:                       number;
    shop?:                         string;
    user?:                         IUser;
    product?:                      IProduct;
    quantity?:                     number;
    sku?:                          string;
    size?:                         string;
    color?:                        string;
    images?:                       Image[];
    bodyMeasurements?:             any[];
    status?:                       IStatus;
    amount?:                       IAmount[];
    expectedVendorCompletionDate?: IExpectedDate;
    expectedDeliveryDate?:         IExpectedDate;
    deliveryMethod?:               string;
    shopRevenue?:                  IShopRevenue;
    cancel?:                       ICancel;
    updatedAt?:                    Date;
    createdAt?:                    Date;
    confirmedAt?:                  string;
    deliveryCompany?:              IDeliveryCompany;
    deliveryDate?:                 string;
    deliveryTrackingLink?:         string;
    deliveryTrackingNumber?:       string;
    __v?:                          number;
};

interface IAmount {
    currency?: string;
    value?:    number;
    _id?:      string;
};

interface ICancel {
    isCancelled?: boolean;
};

interface IDeliveryCompany {
};

interface IExpectedDate {
    min?: string;
    max?: string;
};

interface Image {
    link?:      string;
    name?:      string;
    _id?:       string;
    isDefault?: boolean;
};

interface IProduct {
    _id?:                 string;
    productId?:           string;
    productType?:         string;
    disabled?:            boolean;
    shopId?:              string;
    title?:               string;
    subTitle?:            string;
    status?:              string;
    autoPriceAdjustment?: IAutoPriceAdjustment;
    currentStep?:         number;
    categories?:          ICategories;
    description?:         string;
    sizes?:               string[];
    postedBy?:            string;
    shop?:                string;
    timeLine?:            ITimeLine[];
    rejectionReasons?:    any[];
    colors?:              IColor[];
    variations?:          IVariation[];
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    sizeStandard?:        string;
    isBespoke?:           boolean;
    isReadyMade?:         boolean;
    promo?:               IPromo;
};

interface IAutoPriceAdjustment {
    isAdjustable?:         boolean;
    adjustmentPercentage?: number;
};

interface ICategories {
    style?:        string[];
    gender?:       string[];
    age?:          IAge;
    brand?:        string;
    design?:       string[];
    occasion?:     string[];
    heelHeight?:   string;
    heelType?:     string;
    fastening?:    string[];
    main?:         string[];
    productGroup?: string;
    fit?:          any[];
};

export interface IAge {
    ageGroup?: string;
};

export interface IColor {
    value?:  string;
    images?: Image[];
    _id?:    string;
};

export interface IPromo {
    promoId?:            string;
    discountPercentage?: number;
}

export interface ITimeLine {
    date?:        string;
    description?: string;
    actionBy?:    string;
    _id?:         string;
}

export interface IVariation {
    sku?:        string;
    price?:      number;
    discount?:   number;
    colorValue?: string;
    size?:       string;
    quantity?:   number;
    bespoke?:    IBespoke;
    _id?:        string;
}

export interface IBespoke {
    isBespoke?:       boolean;
    availableColors?: any[];
}

export interface IShopRevenue {
    currency?: string;
    value?:    number;
    status?:   string;
    paidAt?:   null;
}

export interface IStatus {
    name?:  string;
    value?: string;
}

export interface IUser {
    _id?:                 string;
    userId?:              string;
    signInCount?:         number;
    firstName?:           string;
    lastName?:            string;
    displayName?:         string;
    disabled?:            boolean;
    isAdmin?:             boolean;
    superAdmin?:          boolean;
    email?:               string;
    emailVerified?:       boolean;
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    uid?:                 string;
    shopEnabled?:         boolean;
    shopId?:              string;
    address?:             string;
    region?:              string;
    country?:             string;
    phoneNumber?:         string;
    role?:                string;
    imageUrl?:            ImageURL;
    prefferedCurrency?:   string;
    phoneNumberVerified?: boolean;
    acceptMarketing?:     boolean;
    isBlogAuthor?:        boolean;
    social?:              Social;
}

interface ImageURL {
    link?: string;
    name?: string;
}

interface Social {
    instagram?: string;
    _id?:       string;
}

export type { IProduct, ICategories, IAmount, IAutoPriceAdjustment, ICancel, IExpectedDate };
export default IOrder;