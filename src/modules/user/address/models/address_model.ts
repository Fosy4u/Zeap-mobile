interface IAddress {
    __v?:         number;
    _id?:         string;
    user?:        string;
    firstName?:   string;
    lastName?:    string;
    address?:     string;
    region?:      string;
    country?:     string;
    postCode?:    string;
    phoneNumber?: string;
    deliveryNote?: string;
    isDefault?:   boolean;
    disabled?:    boolean;
    createdAt?:   Date;
    updatedAt?:   Date;
}

export default IAddress;