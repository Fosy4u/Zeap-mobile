interface IRequiredMeasurementFormFields {
    _id?:          string;
    productId?:    string;
    measurements?: IMeasurementField[];
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