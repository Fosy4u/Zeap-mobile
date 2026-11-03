interface IVendorProductQueryParams {
    shopId?: string;
    productType?: string;
    accessoryType?: string;
    price?: number;
    sizes?: number[];
    title?: string;
    colors?: string[];
    brand?: string;
    design?: string;
    gender?: string;
    ageGroup?: string;
    ageRange?: string;
    style?: string;
    main?: string;
    sleeveLength?: string;
    fastening?: string;
    fit?: string;
    occasion?: string;
    productId?: string;
    status?: string;
    noCurrencyConversion?: boolean;
    currency?: string;
    limit: number; // Required with default value
    pageNumber: number; // Required with default value
};

export default IVendorProductQueryParams;