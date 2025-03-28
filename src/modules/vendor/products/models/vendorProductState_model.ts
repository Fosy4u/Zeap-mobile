import IDraftProduct from "./vendorDraftProducts_model";
import IVendorProduct from "./vendorProduct_model";
import IVendorProductDetails from "./vendorProductDetails_model";

interface IVendorProductState {
    productMode: string;
    selectedStep: number;
    tabs: string[];
    clotheType: string;
    selectedTab: string;
    timelines: string[];
    savedMeasurements: ISavedMeasurement[];
    savedAddresses: ISavedAddress[];

    products: IVendorProduct[];
    product: IVendorProductDetails;
    draftProducts: IDraftProduct[];
    selectedDraftProduct: IDraftProduct;

    isLoadingProducts: boolean;
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
