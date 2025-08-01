interface IVendorProductBodyMeasurement {
    _id?:          string;
    productId?:    string;
    measurements?: IMeasurementField[];
    updatedAt?:    Date;
    createdAt?:    Date;
    __v?:          number;
}

interface IMeasurementField {
    name?:   string;
    fields?: string[];
    _id?:    string;
}

export type { IMeasurementField };
export default IVendorProductBodyMeasurement;