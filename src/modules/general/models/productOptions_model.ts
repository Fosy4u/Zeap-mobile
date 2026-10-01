interface IProductOptions {
    readyMadeClothes?: IClothes;
    readyMadeShoes?:   IShoes;
    accessories?:      IAccessories;
    bespokeClothes?:   IClothes;
    bespokeShoes?:     IShoes;
    productTypeEnums?: string[];
}

interface IAccessories {
    genderEnums?:         string[];
    ageGroupEnums?:       string[];
    ageRangeEnums?:       string[];
    statusEnums?:         string[];
    accessoryTypeEnums?:  string[];
    accessoryStyleEnums?: string[];
    accessorySizeEnums?:  string[];
    designEnums?:         string[];
    fasteningEnums?:      string[];
    occasionEnums?:       string[];
    brandEnums?:          string[];
    colorEnums?:          IColorEnum[];
}

interface IColorEnum {
    name?:       string;
    hex?:        string;
    background?: string;
}

interface IClothes {
    mainEnums?:               string[];
    genderEnums?:             string[];
    ageGroupEnums?:           string[];
    ageRangeEnums?:           string[];
    statusEnums?:             string[];
    clothStyleEnums?:         string[];
    sleeveLengthEnums?:       string[];
    designEnums?:             string[];
    fasteningEnums?:          string[];
    occasionEnums?:           string[];
    fitEnums?:                string[];
    brandEnums?:              string[];
    clothSizeEnums?:          string[];
    // Sizes grouped per size standard (e.g. { US: [...], UK: [...] }).
    clothSizeEnumsByRegion?:  ISizeEnumsByRegion;
    // Available size standards, e.g. ["AUS","CAN","EU","INTL","UK","US"].
    sizeStandardEnums?:       string[];
    colorEnums?:              IColorEnum[];
    bodyMeasurementEnums?:    IBodyMeasurementEnum[];
}

// Size lists keyed by size standard / region code (US, UK, EU, AUS, CAN, INTL, CM…).
interface ISizeEnumsByRegion {
    [region: string]: string[];
}

interface IBodyMeasurementEnum {
    gender?: string;
    value?:  IValue[];
}

interface IValue {
    name?: string;
    fields?: string[];
}

interface IShoes {
    genderEnums?:           string[];
    ageGroupEnums?:         string[];
    ageRangeEnums?:         string[];
    statusEnums?:           string[];
    shoeStyleEnums?:        string[];
    shoeTypeEnums?:         string[];
    designEnums?:           string[];
    fasteningEnums?:        string[];
    occasionEnums?:         string[];
    brandEnums?:            string[];
    colorEnums?:            IColorEnum[];
    heelHeightEnums?:       string[];
    heelTypeEnums?:         string[];
    bodyMeasurementEnums?:  IBodyMeasurementEnum[];
    shoeSizeEnums?:         string[];
    // Sizes grouped per size standard (e.g. { US: [...], EU: [...], CM: [...] }).
    shoeSizeEnumsByRegion?: ISizeEnumsByRegion;
    sizeStandardEnums?:     string[];
}


export type { IAccessories, IBodyMeasurementEnum, IColorEnum, IValue, IClothes, IShoes, ISizeEnumsByRegion };
export default IProductOptions;
