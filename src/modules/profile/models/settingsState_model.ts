interface ISettingState {
    phoneCodeOptions: IDropdownOptions[];
    heightUnitOptions: IDropdownOptions[];
    weightUnitOptions: IDropdownOptions[];
    complexionOptions: IDropdownOptions[];
    shoeSizeOptions: IDropdownOptions[];
    bestOutfitOptions: IDropdownOptions[];
    bestColorOptions: IDropdownOptions[];
}

interface IDropdownOptions {
    key: string;
    value: string;
}

export default ISettingState;