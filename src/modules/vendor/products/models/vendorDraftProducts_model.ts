interface IDraftProduct {
    __v?:                 number;
    _id?:                 string;
    autoPriceAdjustment?: IAutoPriceAdjustment;
    bodyMeasurement?:     string;
    categories?:          ICategories;
    colors?:              IColor[];
    createdAt?:           Date;
    currentStep?:         number;
    description?:         string;
    disabled?:            boolean;
    postedBy?:            IPostedBy;
    productId?:           string;
    productType?:         string;
    rejectionReasons?:    any[];
    shop?:                IShop;
    shopId?:              string;
    sizes?:               string[];
    status?:              string;
    subTitle?:            string;
    timeLine?:            ITimeLine[];
    title?:               string;
    updatedAt?:           Date;
    variations?:          IVariation[];
}

interface IAutoPriceAdjustment {
    adjustmentPercentage?: number;
    isAdjustable?:         boolean;
}

interface ICategories {
    age?:          IAge;
    brand?:        string;
    design?:       string[];
    fastening?:    string[];
    fit?:          string[];
    gender?:       string[];
    main?:         string[];
    occasion?:     string[];
    productGroup?: string;
    sleeveLength?: string;
    style?:        string[];
}

interface IAge {
    ageGroup?: string;
    ageRange?: string;
}

interface IColor {
    _id?:    string;
    images?: string[];
    value?:  string;
}

interface IPostedBy {
    __v?:                 number;
    _id?:                 string;
    createdAt?:           Date;
    createdBy?:           string;
    disabled?:            boolean;
    email?:               string;
    emailVerified?:       boolean;
    firstName?:           string;
    isAdmin?:             boolean;
    isGuest?:             boolean;
    isVendor?:            boolean;
    lastName?:            string;
    phoneNumberVerified?: boolean;
    points?:              number;
    prefferedCurrency?:   string;
    shopEnabled?:         boolean;
    shopId?:              string;
    signInCount?:         number;
    social?:              string[];
    superAdmin?:          boolean;
    uid?:                 string;
    updatedAt?:           Date;
    userId?:              string;
}

interface IShop {
    __v?:            number;
    _id?:            string;
    createdAt?:      Date;
    currency?:       string[];
    disabled?:       boolean;
    isMakeUpArtist?: boolean;
    isShoeMaker?:    boolean;
    isTailor?:       boolean;
    shopId?:         string;
    shopName?:       string;
    updatedAt?:      Date;
    user?:           string;
    userId?:         string;
}

interface ITimeLine {
    _id?:         string;
    actionBy?:    string;
    date?:        string;
    description?: string;
}

interface IVariation {
    _id?:        string;
    bespoke?:    string[];
    colorValue?: string;
    price?:      number;
    quantity?:   number;
    size?:       string;
    sku?:        string;
}


export type {
    IAutoPriceAdjustment,
    // ICategories,
    // IAge,
    // IColor,
    // IPostedBy,
    // IShop,
    // ITimeLine,
    // IVariation,
};
export default IDraftProduct;