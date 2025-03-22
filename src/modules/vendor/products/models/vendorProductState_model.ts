import IDraftProduct from "./vendorDraftProducts_model";

interface IVendorProductState {
    productMode: string;
    selectedStep: number;
    tabs: string[];
    clotheType: string;
    selectedTab: string;
    timelines: string[];
    savedMeasurements: ISavedMeasurement[];
    savedAddresses: ISavedAddress[];

    draftProducts: IDraftProduct[];
    selectedDraftProduct: IDraftProduct;
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
