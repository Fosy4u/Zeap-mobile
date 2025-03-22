interface IAddress {
    __v?:         number;
    _id?:         string;
    address?:     string;
    country?:     string;
    createdAt?:   Date;
    disabled?:    boolean;
    isDefault?:   boolean;
    phoneNumber?: string;
    region?:      string;
    updatedAt?:   Date;
    user?:        string;
}

export default IAddress;