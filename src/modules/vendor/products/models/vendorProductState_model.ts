import IPromotion from "./promotion_model";
import IVendorProductDetails from "./vendorProductDetails_model";

interface IVendorProductState {
    productMode: string;
    selectedStep: number;
    tabs: string[];
    productType: string;
    clotheType: string;
    shoeType: string;
    selectedTab: string;
    timelines: string[];
    savedMeasurements: ISavedMeasurement[];
    savedAddresses: ISavedAddress[];

    products: IVendorProductDetails[];
    product: IVendorProductDetails;
    draftProducts: IVendorProductDetails[];
    productPromotion: IPromotion;

    showProductTypeBottomSheet: boolean;

    productIsLoading: boolean;
    loadingMessage: string;
};


interface ISavedMeasurement {
    id: string;
    title: string;
    items: string[];
};

interface ISavedAddress {
    id: string;
    title: string;
    phone: string;
    email: string;
    streetAddress: string;
};


export type { ISavedMeasurement, ISavedAddress };
export default IVendorProductState;
