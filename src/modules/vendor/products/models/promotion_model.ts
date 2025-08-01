interface IPromotion {
    smallScreenImageUrl?:   IScreenImageURL;
    largeScreenImageUrl?:   IScreenImageURL;
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

interface IScreenImageURL {
    link?: string;
    name?: string;
    type?: string;
};

// Apply Promotion Payload
interface IPromotionPayload {
    discountPercentage: number;
    productId: string;
    promoId: string;
};

export type { IDiscount, IRangePercentage, IScreenImageURL, IPromotionPayload };
export default IPromotion;
