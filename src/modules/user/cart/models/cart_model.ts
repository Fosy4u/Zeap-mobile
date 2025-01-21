interface ICart {
    user?:        string;
    basketId?:    string;
    basketItems?: BasketItem[];
    _id?:         string;
    updatedAt?:   Date;
    createdAt?:   Date;
    __v?:         number;
}

interface BasketItem {
    product?:  string;
    quantity?: number;
    sku?:      string;
    _id?:      string;
}


export default ICart;