import IAddress from "./address_model";

interface IAddressState {
    deliveryAddresses: IAddress[];
    selectedAddress: IAddress;

    selectedDeliveryAddressID: string;
    saveAddressForNextTime: boolean;
    selectedCountry: string;

    showEditEmail: boolean;
    showNewDeliveryAddressForm: boolean;

    isLoading: boolean;
    loadingMessage: string;
};

export default IAddressState;