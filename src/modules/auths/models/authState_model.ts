// Captures the screen the user was trying to reach when an auth gate
// bounced them to the login flow, so we can return them to it after a
// successful sign-in / sign-up. Cleared on consume.
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