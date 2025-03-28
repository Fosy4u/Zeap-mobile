interface IVendorProductDetails {
    __v?:              number;
    _id?:              string;
    promo?:            IPromo;
    categories?:       ICategories;
    productId?:        string;
    productType?:      string;
    disabled?:         boolean;
    shopId?:           string;
    title?:            string;
    status?:           string;
    currentStep?:      number;
    description?:      string;
    sizes?:            string[];
    postedBy?:         By;
    shop?:             IShop;
    colors?:           IColor[];
    variations?:       IVariation[];
    updatedAt?:        Date;
    createdAt?:        Date;
    timeLine?:         ITimeLine[];
    rejectionReasons?: any[];
    currency?:         Currency;
}

interface IPromo {
    promoId?:            string;
    discountPercentage?: number;
}

interface ICategories {
    age?:          IAge;
    fit?:          string[];
    style?:        string[];
    gender?:       string[];
    brand?:        string;
    design?:       string[];
    occasion?:     string[];
    heelHeight?:   string;
    heelType?:     string;
    fastening?:    string[];
    main?:         string[];
    productGroup?: string;
}

interface IAge {
    ageGroup?: string;
}

interface IColor {
    value?:  string;
    images?: IImage[];
    _id?:    string;
}

interface IImage {
    link?:      string;
    name?:      string;
    isDefault?: boolean;
    _id?:       string;
}

interface Currency {
    name?:   string;
    symbol?: string;
    _id?:    string;
}

interface By {
    _id?:                 string;
    __v?:                 number;
    uid?:                 string;
    imageUrl?:            ImageURL;
    createdBy?:           string;
    phoneNumberVerified?: boolean;
    isVendor?:            boolean;
    points?:              number;
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
    shopEnabled?:         boolean;
    shopId?:              string;
    address?:             string;
    region?:              string;
    country?:             string;
    phoneNumber?:         string;
    role?:                string;
}

interface ImageURL {
    link?: string;
    name?: string;
}

interface IShop {
    isMakeUpArtist?: boolean;
    _id?:            string;
    shopId?:         string;
    user?:           string;
    userId?:         string;
    shopName?:       string;
    isTailor?:       boolean;
    isShoeMaker?:    boolean;
    disabled?:       boolean;
    currency?:       Currency;
    updatedAt?:      Date;
    createdAt?:      Date;
    __v?:            number;
}

interface ITimeLine {
    date?:        string;
    description?: string;
    actionBy?:    By;
    _id?:         string;
}

interface IVariation {
    sku?:        string;
    price?:      number;
    colorValue?: string;
    size?:       string;
    discount?:   number;
    quantity?:   number;
    bespoke?:    IBespoke;
    _id?:        string;
    currency?:   string;
}

interface IBespoke {
    isBespoke?:       boolean;
    availableColors?: any[];
}

export type { ICategories, IAge, IColor, IImage, Currency, By, ImageURL, IShop, ITimeLine, IVariation };
export default IVendorProductDetails;