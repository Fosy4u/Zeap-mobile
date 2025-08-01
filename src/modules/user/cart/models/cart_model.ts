interface ICart {
    __v?:         number;
    _id?:         string;
    basketId?:    string;
    basketItems?: BasketItem[];
    createdAt?:   Date;
    updatedAt?:   Date;
    user?:        string;
    currency?:    string;
    subTotal?:    number;
}

interface BasketItem {
    _id?:                string;
    actualAmount?:       number;
    bespokeColor?:       string;
    bespokeInstruction?: string;
    bodyMeasurements?:   BodyMeasurement[];
    color?:              string;
    currency?:           string;
    discountedAmount?:   null;
    image?:              string;
    originalAmount?:     number;
    productId?:          string;
    quantity?:           number;
    size?:               string;
    sku?:                string;
    title?:              string;
}

interface BodyMeasurement {
    name?:         string;
    measurements?: Measurement[];
    _id?:          string;
}

interface Measurement {
    field?: string;
    value?: number;
    unit?:  string;
    _id?:   string;
}

export default ICart;