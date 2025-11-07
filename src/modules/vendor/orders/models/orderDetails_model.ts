interface IOrderDetails {
    _id?:                          string;
    order?:                        IOrder;
    disabled?:                     boolean;
    orderId?:                      string;
    itemNo?:                       number;
    shop?:                         IShop;
    user?:                         IUser;
    product?:                      IProduct;
    quantity?:                     number;
    sku?:                          string;
    size?:                         string;
    color?:                        string;
    images?:                       IImage[];
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
    deliveryDetails?:              IDeliveryDetails;
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

interface IDeliveryDetails {
    address?:     string;
    region?:      string;
    country?:     string;
    phoneNumber?: string;
    firstName?:   string;
    lastName?:    string;
    _id?:         string;
};

interface IExpectedDate {
    min?: string;
    max?: string;
};

interface IImage {
    link?:      string;
    name?:      string;
    _id?:       string;
    isDefault?: boolean;
};

interface IOrder {
    _id?:             string;
    orderId?:         string;
    disabled?:        boolean;
    user?:            string;
    productOrders?:   string[];
    payment?:         string;
    deliveryDetails?: IDeliveryDetails;
    updatedAt?:       Date;
    createdAt?:       Date;
    __v?:             number;
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
    sizeStandard?:        string;
    isBespoke?:           boolean;
    isReadyMade?:         boolean;
    promo?:               IPromo;
    __v?:                 number;
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

interface IAge {
    ageGroup?: string;
};

interface IColor {
    value?:  string;
    images?: IImage[];
    _id?:    string;
};

interface IPromo {
    promoId?:            string;
    discountPercentage?: number;
};

interface ITimeLine {
    date?:        string;
    description?: string;
    actionBy?:    string;
    _id?:         string;
};

interface IVariation {
    sku?:        string;
    price?:      number;
    discount?:   number;
    colorValue?: string;
    size?:       string;
    quantity?:   number;
    bespoke?:    IBespoke;
    _id?:        string;
};

interface IBespoke {
    isBespoke?:       boolean;
    availableColors?: any[];
};

interface IShop {
    _id?:         string;
    shopId?:      string;
    user?:        string;
    userId?:      string;
    shopName?:    string;
    isTailor?:    boolean;
    isShoeMaker?: boolean;
    disabled?:    boolean;
    currency?:    ICurrency;
    updatedAt?:   Date;
    createdAt?:   Date;
    status?:      string;
    __v?:         number;
};

interface ICurrency {
    name?:   string;
    symbol?: string;
    _id?:    string;
};

interface IShopRevenue {
    currency?: string;
    value?:    number;
    status?:   string;
    paidAt?:   string;
};

interface IStatus {
    name?:  string;
    value?: string;
};

interface IUser {
    _id?:                 string;
    userId?:              string;
    uid?:                 string;
    shopEnabled?:         boolean;
    signInCount?:         number;
    firstName?:           string;
    lastName?:            string;
    disabled?:            boolean;
    isAdmin?:             boolean;
    superAdmin?:          boolean;
    email?:               string;
    createdBy?:           string;
    social?:              ISocial;
    emailVerified?:       boolean;
    phoneNumberVerified?: boolean;
    isVendor?:            boolean;
    points?:              number;
    updatedAt?:           Date;
    createdAt?:           Date;
    phoneNumber?:         string;
    prefferedCurrency?:   string;
    shopId?:              null;
    isGuest?:             boolean;
    initialPointGiven?:   boolean;
    welcomeEmailSent?:    boolean;
    __v?:                 number;
};

interface ISocial {
    _id?: string;
};

export default IOrderDetails;
