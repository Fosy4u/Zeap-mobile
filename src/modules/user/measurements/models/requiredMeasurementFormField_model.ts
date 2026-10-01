interface IRequiredMeasurementFormFields {
    _id?:          string;
    productId?:    string;
    measurements?: IMeasurementField[];
    // Optional note the vendor attached to this product's required measurements
    // (set in the vendor add-product step-3 "additional measurement note").
    // Shown read-only to the buyer when present.
    additionalMeasurementNote?: string;
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
export default IRequiredMeasurementFormFields;