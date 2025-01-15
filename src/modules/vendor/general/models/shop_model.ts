interface IShop {
    isMakeUpArtist?: boolean;
    _id?:            string;
    shopId?:         string;
    user?:           IUser;
    userId?:         string;
    shopName?:       string;
    isTailor?:       boolean;
    isShoeMaker?:    boolean;
    disabled?:       boolean;
    currency?:       ICurrency;
    updatedAt?:      Date;
    createdAt?:      Date;
    __v?:            number;
};

interface ICurrency {
    name?:   string;
    symbol?: string;
    _id?:    string;
};

interface IUser {
    createdBy?:           string;
    _id?:                 string;
    userId?:              string;
    uid?:                 string;
    shopEnabled?:         boolean;
    signInCount?:         number;
    firstName?:           string;
    lastName?:            string;
    displayName?:         string;
    disabled?:            boolean;
    isAdmin?:             boolean;
    superAdmin?:          boolean;
    email?:               string;
    emailVerified?:       boolean;
    isVendor?:            boolean;
    points?:              number;
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    shopId?:              string;
    address?:             string;
    phoneNumber?:         string;
    phoneNumberVerified?: boolean;
    social?:              ISocial;
};

interface ISocial {
    instagram?: string;
    website?:   string;
    _id?:       string;
};

export default IShop;