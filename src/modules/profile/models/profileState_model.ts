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
    showEditEmail: boolean;
    acceptMarketing: boolean;
    isLoading: boolean;
    loadingMessage: string;
};


interface IUser {
    _id?:                 string;
    __v?:                 number;
    userId?:              string;
    signInCount?:         number;
    firstName?:           string;
    lastName?:            string;
    displayName?:         string;
    disabled?:            boolean;
    isAdmin?:             boolean;
    isGuest?:             string;
    isVendor?:            boolean;
    superAdmin?:          boolean;
    email?:               string;
    createdBy?:           string;
    emailVerified?:       boolean;
    uid?:                 string;
    shopEnabled?:         boolean;
    shopId?:              string;
    address?:             string;
    region?:              string;
    country?:             string;
    phoneNumber?:         string;
    role?:                string;
    prefferedCurrency?:   string;
    phoneNumberVerified?: boolean;
    points?:              number;
    acceptMarketing?:     boolean;
    isBlogAuthor?:        boolean;
    updatedAt?:           Date;
    createdAt?:           Date;
    imageUrl?:            ImageURL;
    social?:              Social;
};

interface ImageURL {
    link?: string;
    name?: string;
}
interface Social {
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