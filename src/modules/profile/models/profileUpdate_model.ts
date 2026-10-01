interface IProfileUpdate {
    _id:              string;
    email?:           string;
    firstName?:       string;
    lastName?:        string;
    phoneNumber?:     string;
    country?:         string;
    region?:          string;
    address?:         string;
    acceptMarketing?: boolean;
};

export default IProfileUpdate;
