interface IProductFilterQueryParams {
    shopId?: string;
    productType?: string | string[];
    main?: string | string[];
    accessoryType?: string | string[];
    gender?: string;
    ageGroup?: string;
    ageRange?: string | string[];
    colors?: string | string[];
    style?: string | string[];
    design?: string | string[];
    sizes?: string | string[];
    brand?: string | string[];
    fit?: string | string[];
    fastening?: string | string[];
    occasion?: string | string[];
    sleeveLength?: string | string[];
    heelHeight?: string | string[];
    heelType?: string | string[];
    price?: string;
    title?: string;
    productId?: string;

    // Pagination   (Required with default value)
    limit: number;
    pageNumber: number;
};

export default IProductFilterQueryParams;