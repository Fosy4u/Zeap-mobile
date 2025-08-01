interface IAddress {
    __v?:         number;
    _id?:         string;
    address?:     string;
    country?:     string;
    disabled?:    boolean;
    isDefault?:   boolean;
    phoneNumber?: string;
    region?:      string;
    createdAt?:   Date;
    updatedAt?:   Date;
    user?:        string;
}

export default IAddress;