interface IDynamicFilter {
    name?:    string;
    type?:    Type;
    options?: Option[] | OptionsClass;
};

interface Option {
    value?: string;
    slug?: string;
    count?: number;
};

interface OptionsClass {
    min?: number;
    max?: number;
};

enum Type {
    Checkbox = "checkbox",
    Range = "range",
};

export default IDynamicFilter;