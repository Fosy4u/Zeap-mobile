interface ISettingState {
    phoneCodeOptions: IDropdownOptions[];
}

interface IDropdownOptions {
    key: string;
    value: string;
}

export default ISettingState;