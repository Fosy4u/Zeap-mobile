interface IVoucher {
  _id: string;
  code: string;
  amount: number;
  expiryDate: string;
  isUsed: boolean;
  source: string;
  user: string | IUser;
  currency: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
};

interface IUser {
    _id?:                 string;
    userId?:              string;
    uid?:                 string;
    shopEnabled?:         boolean;
    signInCount?:         number;
    firstName?:           string;
    lastName?:            string;
    disabled?:            boolean;
    isAdmin?:             boolean;
    superAdmin?:          boolean;
    email?:               string;
    createdBy?:           string;
    social?:              ISocial;
    emailVerified?:       boolean;
    phoneNumberVerified?: boolean;
    isVendor?:            boolean;
    points?:              number;
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    phoneNumber?:         string;
    prefferedCurrency?:   string;
    shopId?:              null;
    isGuest?:             boolean;
    initialPointGiven?:   boolean;
    welcomeEmailSent?:    boolean;
};

interface ISocial {
    _id?: string;
};

export default IVoucher;