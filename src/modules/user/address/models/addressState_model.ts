import IAddress from "./address_model";

interface IAddressState {
    allSavedAddresses: IAddress[];
    selectedAddress: IAddress;

    selectedDeliveryAddressID: string;
    saveAddressForNextTime: boolean;
    showSavedAddressesBottomSheet: boolean;
    selectedCountry: string;
};

export default IAddressState;