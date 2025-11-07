interface IPromoProduct {
    imageUrl?:              ImageURL;
    discount?:              IDiscount;
    _id?:                   string;
    promoId?:               string;
    startDate?:             string;
    endDate?:               string;
    description?:           string;
    title?:                 string;
    status?:                string;
    subTitle?:              string;
    productIds?:            string[];
    permittedProductTypes?: string[];
    updatedAt?:             Date;
    createdAt?:             Date;
    __v?:                   number;
    largeScreenImageUrl?:   ScreenImageURL;
    smallScreenImageUrl?:   ScreenImageURL;
};

interface IDiscount {
    rangePercentage?: IRangePercentage;
    type?:            string;
    fixedPercentage?: number;
};

interface IRangePercentage {
    min?: number;
    max?: number;
};

interface ImageURL {
    type?: string;
};

interface ScreenImageURL {
    link?: string;
    name?: string;
    type?: string;
};

export default IPromoProduct;
