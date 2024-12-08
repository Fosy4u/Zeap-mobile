interface IProduct {
    [x: string]: any;
    _id:              string;
    productId:        string;
    productType:      string;
    disabled:         boolean;
    shopId:           string;
    title:            string;
    status:           string;
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
    sku:        string;
    price:      number;
    colorValue: string;
    size:       string;
    quantity:   number;
    _id:        string;
}


export type { ICategories, IAge, IColor, IImage, ITimeLine, IVariation };
export default IProduct;