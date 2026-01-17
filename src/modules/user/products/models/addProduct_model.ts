interface addReadyMadeProduct {
    productId: string;
    quantity: number;
    sku: string;
    size: number;
};

interface addBespokeMultipleColorProduct {
    productId: string;
    quantity: number;
    sku: string;
    bespokeInstruction: string;
    bodyMeasurements: any[];
};

interface addBespokeSingleColorProduct {
    productId: string;
    quantity: number;
    sku: string;
    bespokeColor: string;
    bespokeInstruction: string;
    bodyMeasurements: any[];
};

export type { addReadyMadeProduct, addBespokeMultipleColorProduct, addBespokeSingleColorProduct };