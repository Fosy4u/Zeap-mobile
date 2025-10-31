interface IPayment {
    productOrder_id?:  string;
    purchaseDate?:     Date;
    buyerPaid?:        BuyerPaid;
    shopRevenue?:      ShopRevenue;
    purchasedProduct?: PurchasedProduct;
};

interface BuyerPaid {
    currency?: string;
    value?:    number;
    _id?:      string;
};

interface PurchasedProduct {
    title?:       string;
    productId?:   string;
    productType?: string;
    sku?:         string;
    images?:      Image[];
};

interface Image {
    link?: string;
    name?: string;
    _id?:  string;
};

interface ShopRevenue {
    currency?: string;
    value?:    number;
    status?:   string;
    paidAt?:   null;
};

export default IPayment;