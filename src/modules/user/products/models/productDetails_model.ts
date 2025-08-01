interface IProductDetails {
    promo?:            Promo;
    categories?:       Categories;
    _id?:              string;
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
    shop?:             Shop;
    colors?:           IColor[];
    variations?:       IVariation[];
    updatedAt?:        Date;
    createdAt?:        Date;
    __v?:              number;
    timeLine?:         ITimeLine[];
    rejectionReasons?: any[];
    currency?:         Currency;
}

interface Promo {
    promoId?:            string;
    discountPercentage?: number;
}

interface Categories {
    age?:          Age;
    fit?:          any[];
    style?:        string[];
    gender?:       string[];
    brand?:        string;
    design?:       string[];
    occasion?:     string[];
    heelHeight?:   string;
    heelType?:     string;
    sleeveLength?: string;
    fastening?:    string[];
    main?:         string[];
    productGroup?: string;
}

interface Age {
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
    imageUrl?:            ImageURL;
    createdBy?:           string;
    phoneNumberVerified?: boolean;
    isVendor?:            boolean;
    points?:              number;
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
}

interface ImageURL {
    link?: string;
    name?: string;
}

interface Shop {
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
    bespoke?:    Bespoke;
    sku?:        string;
    price?:      number;
    colorValue?: string;
    size?:       string;
    quantity?:   number;
    _id?:        string;
}

interface Bespoke {
    isBespoke?:       boolean;
    colorType?:       string;
    availableColors?: string[];
}

export type { Categories, Age, IColor, IImage, Currency, By, ImageURL, Shop, ITimeLine, IVariation };
export default IProductDetails;