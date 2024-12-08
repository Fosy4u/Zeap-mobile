interface IProductQueryParams {
    shopId?: string;
    productType?: "Ready Made Cloth" | "Ready Made Shoe" | "Accessory";
    accessoryType?: "Bag" | "Belt" | "Gloves" | "Hair Accessories" | "Hat" | "Jewelry" | "Other" | "Scarf" | "Sunglasses" | "Watch";
    price?: number;
    sizes?: number[];
    title?: string;
    colors?: string[];
    brand?: string;
    design?: string;
    gender?: "Male" | "Female";
    ageGroup?: string;
    ageRange?: [number, number];
    style?: string;
    main?: string;
    sleeveLength?: number;
    fastening?: string;
    fit?: string;
    occasion?: string;
    productId?: string;
    limit: number; // Required with default value
    pageNumber: number; // Required with default value
};

export default IProductQueryParams;