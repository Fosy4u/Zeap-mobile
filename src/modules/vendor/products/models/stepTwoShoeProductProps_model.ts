interface IStepTwoShoeProductProps {
    manageState: {
        styleOptions: string[];
        genderOptions: string[];
        ageGroupOptions: string[];
        ageRangeOptions: string[];
        brandOptions: string[];
        designOptions: string[];
        occasionOptions: string[];
        heelHeightOptions: string[];
        heelTypeOptions: string[];
        fasteningOptions: string[];

        selectedStyle: string[];
        setSelectedStyle: React.Dispatch<React.SetStateAction<string[]>>;
        selectedGender: string[];
        setSelectedGender: React.Dispatch<React.SetStateAction<string[]>>;
        selectedAgeGroup: string;
        setSelectedAgeGroup: React.Dispatch<React.SetStateAction<string>>;
        selectedAgeRange: string;
        setSelectedAgeRange: React.Dispatch<React.SetStateAction<string>>;
        selectedBrand: string;
        setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;
        selectedDesign: string[];
        setSelectedDesign: React.Dispatch<React.SetStateAction<string[]>>;
        selectedOccasion: string[];
        setSelectedOccasion: React.Dispatch<React.SetStateAction<string[]>>;
        selectedHeelHeight: string;
        setSelectedHeelHeight: React.Dispatch<React.SetStateAction<string>>;
        selectedHeelType: string;
        setSelectedHeelType: React.Dispatch<React.SetStateAction<string>>;
        selectedFastening: string[];
        setSelectedFastening: React.Dispatch<React.SetStateAction<string[]>>;

        showStyleDropDown: boolean;
        setShowStyleDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showGenderDropDown: boolean;
        setShowGenderDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showAgeDropDown: boolean;
        setShowAgeDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showAgeRangeDropDown: boolean;
        setShowAgeRangeDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showBrandDropDown: boolean;
        setShowBrandDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showDesignDropDown: boolean;
        setShowDesignDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showOccasionDropDown: boolean;
        setShowOccasionDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showHeelHeightDropDown: boolean;
        setShowHeelHeightDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showHeelTypeDropDown: boolean;
        setShowHeelTypeDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showFasteningDropDown: boolean;
        setShowFasteningDropDown: React.Dispatch<React.SetStateAction<boolean>>;
    };
};

export default IStepTwoShoeProductProps;