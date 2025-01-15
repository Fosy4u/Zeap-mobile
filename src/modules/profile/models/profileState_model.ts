interface IProfileState {
    userData: IUser;
    token: string;
    selectedPhoneCode: IPhoneCodeDropdownOptions;
    phoneCodeOptions: IPhoneCodeDropdownOptions[];
    showPhoneCodeModal: boolean;
    selectedCountry: string;
    showCountryModal: boolean;
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

interface IPhoneCodeDropdownOptions {
    name: string;
    dial_code: string;
    code: string;
    emoji: string;
}

export type { IUser, IPhoneCodeDropdownOptions };
export default IProfileState;