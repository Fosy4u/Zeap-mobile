interface IProfileState {
    userData: IUser;
    token: string;
    phoneCodeOptions: IDropdownOptions[];
    heightUnitOptions: IDropdownOptions[];
    weightUnitOptions: IDropdownOptions[];
    complexionOptions: IDropdownOptions[];
    shoeSizeOptions: IDropdownOptions[];
    bestOutfitOptions: IDropdownOptions[];
    bestColorOptions: IDropdownOptions[];
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
    emailVerified?:       boolean;
    createdBy?:           string;
    social?:              ISocial;
    phoneNumber?:         string;
    phoneNumberVerified?: boolean;
    isVendor?:            boolean;
    points?:              number;
    updatedAt?:           Date;
    createdAt?:           Date;
    __v?:                 number;
    shopId?:              string;
};

interface ISocial {
    _id: string;
}

interface IDropdownOptions {
    key: string;
    value: string;
}

export type { IUser };
export default IProfileState;