import ICuurrency from "./currency_model";

interface ISettingsState {
    currencies: ICuurrency[];
    recommendedCurrency: ICuurrency;
    isLoading: boolean;
    loadingMessage: string;
};

export default ISettingsState;