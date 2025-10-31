interface IProduct {
    [x: string]: any;
    _id:              string;
    productId:        string;
    productType:      string;
    disabled:         boolean;
    shopId:           string;
    title:            string;
    status:           string;
    autoPriceAdjustment: IAutoPriceAdjustment;
    currentStep:      number;
    categories:       ICategories;
    description:      string;
    sizes:            string[];
    postedBy:         string;
    shop:             string;
    colors:           IColor[];
    variations:       IVariation[];
    updatedAt:        Date;
    createdAt:        Date;
    __v:              number;
    timeLine:         ITimeLine[];
    rejectionReasons: any[];
    promo: IPromo
    sizeStandard: string
}

interface IAutoPriceAdjustment {
  isAdjustable: boolean
  adjustmentPercentage: number
}

interface ICategories {
    style:         string[];
    gender:        string[];
    age:           IAge;
    brand:         string;
    design:        string[];
    occasion:      string[];
    accessoryType: string;
    fastening:     string[];
    main:          string[];
    productGroup:  string;
}

interface IAge {
    ageGroup: string;
}

interface IColor {
    value:  string;
    images: IImage[];
    _id:    string;
}

interface IImage {
    link:      string;
    name:      string;
    isDefault: boolean;
    _id:       string;
}

interface ITimeLine {
    date:        string;
    description: string;
    actionBy:    string;
    _id:         string;
}

interface IVariation {
    colorValue?: string;
    currency?:   string;
    discount?:   number;
    price?:      number;
    quantity?:   number;
    size?:       string;
    sku?:        string;
    _id?:        string;
    bespoke?:    IBespoke;
}

interface IPromo {
  promoId: string;
  discountPercentage: number;
  adminControlledDiscount: boolean;
}

interface IBespoke {
    isBespoke: boolean;
    availableColors: any[];
}


export type { IAutoPriceAdjustment, ICategories, IAge, IColor, IImage, ITimeLine, IVariation, IPromo };
export default IProduct;