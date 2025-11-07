interface IStepThreeBespokeShoeProps {
    manageState: {
        footLengthOptions: string[];
        footWidthOptions: string[];
        instepHeightOptions: string[];
        heelWidthOptions: string[];
        archTypeOptions: string[];
        toeLengthOptions: string[];

        selectedFootLength: string;
        setSelectedFootLength: React.Dispatch<React.SetStateAction<string>>;
        selectedFootWidth: string;
        setSelectedFootWidth: React.Dispatch<React.SetStateAction<string>>;
        selectedInstepHeight: string;
        setSelectedInstepHeight: React.Dispatch<React.SetStateAction<string>>;
        selectedHeelWidth: string;
        setSelectedHeelWidth: React.Dispatch<React.SetStateAction<string>>;
        selectedArchType: string;
        setSelectedArchType: React.Dispatch<React.SetStateAction<string>>;
        selectedToeLength: string;
        setSelectedToeLength: React.Dispatch<React.SetStateAction<string>>;
        
        customFootLength: string;
        setCustomFootLength: React.Dispatch<React.SetStateAction<string>>;
        customFootWidth: string;
        setCustomFootWidth: React.Dispatch<React.SetStateAction<string>>;
        customInstepHeight: string;
        setCustomInstepHeight: React.Dispatch<React.SetStateAction<string>>;
        customHeelWidth: string;
        setCustomHeelWidth: React.Dispatch<React.SetStateAction<string>>;
        customToeLength: string;
        setCustomToeLength: React.Dispatch<React.SetStateAction<string>>;
        
        showFootLengthDropDown: boolean;
        setShowFootLengthDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showFootWidthDropDown: boolean;
        setShowFootWidthDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showInstepHeightDropDown: boolean;
        setShowInstepHeightDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showHeelWidthDropDown: boolean;
        setShowHeelWidthDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showArchTypeDropDown: boolean;
        setShowArchTypeDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        showToeLengthDropDown: boolean;
        setShowToeLengthDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        
        isCustomMeasurement: boolean;
        setIsCustomMeasurement: React.Dispatch<React.SetStateAction<boolean>>;
    };
};

export default IStepThreeBespokeShoeProps;