interface IReviewAndRating {
    [x: string]: Key | null | undefined;
    reviews?:       IReview[];
    averageRating?: number;
    imageMatch?:    ImageMatch;
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
    updatedAt?:   string | Date;
    createdAt?:   string | Date;
    __v?:         number;
}

interface ImageMatch {
    true?:  number;
    false?: number;
    total?: number;
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
    updatedAt?:           string | Date;
    createdAt?:           string | Date;
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


export type { IReview, ILikes, IUser, IImageURL };
export default IReviewAndRating;
