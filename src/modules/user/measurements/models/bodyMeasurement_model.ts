interface IBodyMeasurement {
    _id?:          string;
    user?:         string;
    templateName?: string;
    measurements?: IMeasurement[];
    updatedAt?:    Date;
    createdAt?:    Date;
    __v?:          number;
}

interface IMeasurement {
    name?:         string;
    measurements?: IMeasurementMeasurement[];
    _id?:          string;
}

interface IMeasurementMeasurement {
    field?: string;
    value?: number;
    _id?:   string;
}


export type { IMeasurement, IMeasurementMeasurement };
export default IBodyMeasurement;