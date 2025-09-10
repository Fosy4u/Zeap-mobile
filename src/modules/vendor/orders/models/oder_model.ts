interface IOrder {
    _id?:                          string;
    order?:                        string;
    disabled?:                     boolean;
    orderId?:                      string;
    itemNo?:                       number;
    shop?:                         string;
    user?:                         User;
    product?:                      Product;
    quantity?:                     number;
    sku?:                          string;
    size?:                         string;
    color?:                        string;
    images?:                       Image[];
    bodyMeasurements?:             any[];
    status?:                       Status;
    amount?:                       Amount[];
    expectedVendorCompletionDate?: ExpectedDate;
    expectedDeliveryDate?:         ExpectedDate;
    deliveryMethod?:               string;
    shopRevenue?:                  ShopRevenue;
    cancel?:                       Cancel;
    updatedAt?:                    Date;
    createdAt?:                    Date;
    __v?:                          number;
}

interface Amount {
    currency?: string;
    value?:    number;
    _id?:      string;
}

interface Cancel {
    isCancelled?: boolean;
}

interface ExpectedDate {
    min?: string;
    max?: string;
}

interface Image {
    link?:      string;
    name?:      string;
    _id?:       string;
    isDefault?: boolean;
}

interface Product {
    _id?:                 string;
    productId?:           string;
    productType?:         string;
    disabled?:            boolean;
    shopId?:              string;
    title?:               string;
    subTitle?:            string;
    status?:              string;
    autoPriceAdjustment?: AutoPriceAdjustment;
    currentStep?:         number;
    categories?:          Categories;
    description?:         string;
    sizes?:               string[];
    postedBy?:            By;
    shop?:                string;
    timeLine?:            TimeLine[];
    rejectionReasons?:    any[];
    colors?:              Color[];
    variations?:          Variation[];
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    sizeStandard?:        string;
    isBespoke?:           boolean;
    isReadyMade?:         boolean;
    promo?:               Promo;
}

interface AutoPriceAdjustment {
    isAdjustable?:         boolean;
    adjustmentPercentage?: number;
}

interface Categories {
    style?:        string[];
    gender?:       string[];
    age?:          Age;
    brand?:        string;
    design?:       string[];
    occasion?:     string[];
    heelHeight?:   string;
    heelType?:     string;
    fastening?:    string[];
    main?:         string[];
    productGroup?: string;
    fit?:          any[];
}

export interface Age {
    ageGroup?: string;
}

export interface Color {
    value?:  string;
    images?: Image[];
    _id?:    string;
}

export enum By {
    The670D7978289931E87A9B8C64 = "670d7978289931e87a9b8c64",
    The670D7A2C289931E87A9B8C72 = "670d7a2c289931e87a9b8c72",
    The679Bfacbed88C89Bf0C4B196 = "679bfacbed88c89bf0c4b196",
}

export interface Promo {
    promoId?:            string;
    discountPercentage?: number;
}

export interface TimeLine {
    date?:        string;
    description?: string;
    actionBy?:    By;
    _id?:         string;
}

export interface Variation {
    sku?:        string;
    price?:      number;
    discount?:   number;
    colorValue?: string;
    size?:       string;
    quantity?:   number;
    bespoke?:    Bespoke;
    _id?:        string;
}

export interface Bespoke {
    isBespoke?:       boolean;
    availableColors?: any[];
}

export interface ShopRevenue {
    currency?: string;
    value?:    number;
    status?:   string;
    paidAt?:   null;
}

export interface Status {
    name?:  string;
    value?: string;
}

export interface User {
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

export type { Product, Categories, Amount, AutoPriceAdjustment, Image, Cancel, Social, ImageURL, ExpectedDate };
export default IOrder;