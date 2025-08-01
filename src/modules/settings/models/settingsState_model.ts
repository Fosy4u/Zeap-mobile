import ICuurrency from "./currency_model";

interface ISettingsState {
    currencies: ICuurrency[];
    recommendedCurrency: ICuurrency;
    isLoading: boolean;
    loadingMessage: string;
    
    // Password visibility states
    showCurrentPassword: boolean;
    showNewPassword: boolean;
    showConfirmNewPassword: boolean;
};

export default ISettingsState;