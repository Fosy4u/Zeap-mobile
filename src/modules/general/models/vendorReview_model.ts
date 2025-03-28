import { de } from "intl-tel-input/i18n";

interface IVendorPreview {
    reviews?:       IReview[];
    averageRating?: number;
    imageMatch?:    ImageMatch;
}

interface ImageMatch {
    true?:  number;
    false?: number;
    total?: number;
}

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
    users?: any[];
}

interface IUser {
    isGuest?:             boolean;
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
}

interface ISocial {
    _id?: string;
}

export type { IReview };
export default IVendorPreview;