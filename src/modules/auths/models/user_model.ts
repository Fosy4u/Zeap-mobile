interface IUser {
    _id:                 string;
    userId:              string;
    uid:                 string;
    shopEnabled:         boolean;
    signInCount:         number;
    firstName:           string;
    lastName:            string;
    disabled:            boolean;
    isAdmin:             boolean;
    superAdmin:          boolean;
    email:               string;
    createdBy:           string;
    social:              ISocial;
    emailVerified:       boolean;
    phoneNumberVerified: boolean;
    isVendor:            boolean;
    points:              number;
    updatedAt:           Date;
    createdAt:           Date;
    __v:                 number;
    shopId:              string;
}

export interface ISocial {
    _id: string;
}

export default IUser;