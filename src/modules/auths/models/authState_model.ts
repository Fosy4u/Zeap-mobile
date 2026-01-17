interface IAuthState {
    isVendorData: IDropdownOptions[];
    showPassword: boolean,
    showConfirmPassword: boolean,
    rememberMe: boolean;
    showSuccessModal: boolean,
    showBottomSheetModal: boolean,
};

interface IDropdownOptions {
    key: boolean;
    value: string;
};

export default IAuthState;