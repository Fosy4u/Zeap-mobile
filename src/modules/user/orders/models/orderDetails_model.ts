interface IOrderDetails {
    _id?:             string;
    orderId?:         string;
    disabled?:        boolean;
    user?:            IUser;
    productOrders?:   IProductOrder[];
    payment?:         IPayment;
    deliveryDetails?: IDeliveryDetails;
    progress?: IProgress;
    gainedPoints?:    number;
    updatedAt?:       Date;
    createdAt?:       Date;
    __v?:             number;
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

interface IProgress {
    value?: number;
    max?: number;
    min?: number;
};

interface IPayment {
    _id?:                   string;
    user?:                  string;
    fullName?:              string;
    email?:                 string;
    basket?:                string;
    status?:                string;
    gateway?:               string;
    deviceType?:            string;
    amount?:                number;
    itemsTotal?:            number;
    deliveryFee?:           number;
    currency?:              string;
    reference?:             string;
    stripeClientSecret?:    string;
    stripePaymentIntentId?: string;
    appliedVoucherAmount?:  number;
    total?:                 number;
    deliveryMethod?:        string;
    updatedAt?:             Date;
    createdAt?:             Date;
    __v?:                   number;
    bank?:                  string;
    cardType?:              string;
    channel?:               string;
    countryCode?:           string;
    fees?:                  number;
    gatewayResponse?:       string;
    log?:                   ILog[];
    paidAt?:                string;
    transactionDate?:       string;
};

interface ILog {
    id?:      string;
    type?:    string;
    created?: Date;
    data?:    IData;
};

interface IData {
    id?:                                   string;
    object?:                               string;
    amount?:                               number;
    amount_capturable?:                    number;
    amount_details?:                       IAmountDetails;
    amount_received?:                      number;
    application?:                          null;
    application_fee_amount?:               null;
    automatic_payment_methods?:            null;
    canceled_at?:                          null;
    cancellation_reason?:                  null;
    capture_method?:                       string;
    client_secret?:                        string;
    confirmation_method?:                  string;
    created?:                              number;
    currency?:                             string;
    customer?:                             null;
    description?:                          null;
    excluded_payment_method_types?:        null;
    last_payment_error?:                   null;
    latest_charge?:                        null | string;
    livemode?:                             boolean;
    metadata?:                             IMetadata;
    next_action?:                          null;
    on_behalf_of?:                         null;
    payment_method?:                       null | string;
    payment_method_configuration_details?: null;
    payment_method_options?:               IPaymentMethodOptions;
    payment_method_types?:                 string[];
    processing?:                           null;
    receipt_email?:                        null;
    review?:                               null;
    setup_future_usage?:                   null;
    shipping?:                             null;
    source?:                               null;
    statement_descriptor?:                 null;
    statement_descriptor_suffix?:          null;
    status?:                               string;
    transfer_data?:                        null;
    transfer_group?:                       null;
};

interface IAmountDetails {
    tip?: ITip;
};

interface ITip {
};

interface IMetadata {
    basketId?:  string;
    reference?: string;
    userId?:    string;
};

interface IPaymentMethodOptions {
    card?: ICard;
};

interface ICard {
    installments?:           null;
    mandate_options?:        null;
    network?:                null;
    request_three_d_secure?: string;
};

interface IProductOrder {
    _id?:                          string;
    order?:                        string;
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

interface IProduct {
    _id?:                 string;
    productId?:           string;
    productType?:         string;
    disabled?:            boolean;
    shopId?:              string;
    isBespoke?:           boolean;
    isReadyMade?:         boolean;
    title?:               string;
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
};

interface IAutoPriceAdjustment {
    isAdjustable?:         boolean;
    adjustmentPercentage?: number;
};

interface ICategories {
    main?:         string[];
    style?:        string[];
    gender?:       string[];
    age?:          IAge;
    brand?:        string;
    design?:       string[];
    occasion?:     string[];
    sleeveLength?: string;
    fastening?:    any[];
    fit?:          string[];
    productGroup?: string;
};

interface IAge {
    ageGroup?: string;
};

interface IColor {
    value?:  string;
    images?: IImage[];
    _id?:    string;
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
    _id?:            string;
    shopId?:         string;
    user?:           string;
    userId?:         string;
    shopName?:       string;
    email?:          string;
    address?:        string;
    phoneNumber?:    string;
    region?:         string;
    country?:        string;
    isTailor?:       boolean;
    isShoeMaker?:    boolean;
    isMakeUpArtist?: boolean;
    disabled?:       boolean;
    currency?:       ICurrency;
    updatedAt?:      Date;
    createdAt?:      Date;
    __v?:            number;
    status?:         string;
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
    paidAt?:   null;
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
    __v?:                 number;
    phoneNumber?:         string;
    prefferedCurrency?:   string;
    shopId?:              null;
    isGuest?:             boolean;
    initialPointGiven?:   boolean;
    welcomeEmailSent?:    boolean;
};

interface ISocial {
    _id?: string;
};

export type { IStatus };
export default IOrderDetails;