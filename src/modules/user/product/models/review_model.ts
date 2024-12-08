interface IReview {
    likes?:       ILikes;
    dislikes?:    ILikes;
    _id?:         string;
    productId?:   string;
    user?:        IUser;
    rating?:      number;
    title?:       string;
    review?:      string;
    displayName?: string;
    disabled?:    boolean;
    imageMatch?:  boolean;
    updatedAt?:   Date;
    createdAt?:   Date;
    __v?:         number;
}

interface ILikes {
    value?: number;
    users?: string[];
}

interface IUser {
    imageUrl?:            IImageURL;
    createdBy?:           string;
    phoneNumberVerified?: boolean;
    isVendor?:            boolean;
    points?:              number;
    _id?:                 string;
    userId?:              string;
    signInCount?:         number;
    firstName?:           string;
    lastName?:            string;
    displayName?:         string;
    disabled?:            boolean;
    isAdmin?:             boolean;
    superAdmin?:          boolean;
    email?:               string;
    emailVerified?:       boolean;
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    uid?:                 string;
    shopEnabled?:         boolean;
    shopId?:              string;
    address?:             string;
    region?:              string;
    country?:             string;
    phoneNumber?:         string;
    role?:                string;
}

interface IImageURL {
    link?: string;
    name?: string;
}


export type { ILikes, IUser, IImageURL };
export default IReview;
