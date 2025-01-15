interface IVendorProductState {
    tabs: string[];
    selectedTab: string;
    timelines: string[];
    savedMeasurements: ISavedMeasurement[];
    savedAddresses: ISavedAddress[];
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
