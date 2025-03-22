import { IValue } from "../../../general/models/productOptions_model";

interface IAddBodyMeasurement {
    productId: string;
    measurements: IValue[];
};

export default IAddBodyMeasurement;