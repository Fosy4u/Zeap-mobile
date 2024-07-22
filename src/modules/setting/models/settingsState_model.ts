interface ISettingState {
    isSellerOptions: IDropdownOptions[];
    phoneCodeOptions: IDropdownOptions[];
    heightUnitOptions: IDropdownOptions[];
    weightUnitOptions: IDropdownOptions[];
    complexionOptions: IDropdownOptions[];
    shoeSizeOptions: IDropdownOptions[];
    bestOutfitOptions: IDropdownOptions[];
    bestColorOptions: IDropdownOptions[];

    showSuccessModal: boolean;
    showBottomSheetModal: boolean;
};
interface IDropdownOptions {
    key: string;
    value: string;
};

export default ISettingState;