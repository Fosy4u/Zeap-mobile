interface IPendingDestination {
    name: string;
    params?: Record<string, any>;
}

interface IAuthState {
    isVendorData: IDropdownOptions[];
    showPassword: boolean,
    showConfirmPassword: boolean,
    rememberMe: boolean;
    showSuccessModal: boolean,
    showBottomSheetModal: boolean,
    pendingDestination: IPendingDestination | null;
};

export type { IPendingDestination };

interface IDropdownOptions {
    key: boolean;
    value: string;
};

export default IAuthState;