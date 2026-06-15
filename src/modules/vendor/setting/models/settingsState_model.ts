interface ISettingState {
    phoneCodeOptions: IPhoneCodeDropdownOptions[];
}

interface IPhoneCodeDropdownOptions {
    name: string;
    dial_code: string;
    code: string;
    emoji: string;
}

export default ISettingState;