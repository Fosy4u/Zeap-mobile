interface IShop {
    isMakeUpArtist?: boolean;
    _id?:            string;
    shopId?:         string;
    user?:           IUser;
    userId?:         string;
    shopName?:       string;
    email?:          string;
    phoneNumber?:    string;
    address?:        string;
    region?:         string;
    country?:        string;
    isTailor?:       boolean;
    isShoeMaker?:    boolean;
    disabled?:       boolean;
    status?:         string;
    source?:         string;
    welcomeEmailSent?: boolean;
    social?:         ISocial;
    bankDetails?:    IBankDetails;
    currency?:       ICurrency;
    updatedAt?:      Date;
    createdAt?:      Date;
    __v?:            number;
};

interface IBankDetails {
    bankName?:      string;
    accountName?:   string;
    accountNumber?: string;
    _id?:           string;
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
    source?:              string;
    social?:              ISocial;
};

interface ISocial {
    twitter?:   string;
    facebook?:  string;
    instagram?: string;
    website?:   string;
    linkedin?:  string;
    tikTok?:    string;
    _id?:       string;
};

export default IShop;
export type { IBankDetails, ISocial, ICurrency, IUser };
