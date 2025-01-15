interface addReadyMadeProduct {
    productId: string;
    quantity: number;
    sku: string;
};

interface addBespokeMultipleColorProduct {
    productId: string;
};

interface addBespokeSingleColorProduct {
    productId: string;
};

export type { addReadyMadeProduct, addBespokeMultipleColorProduct, addBespokeSingleColorProduct };