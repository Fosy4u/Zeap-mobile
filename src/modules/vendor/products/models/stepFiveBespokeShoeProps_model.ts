interface IStepFiveBespokeShoeProps {
    manageState: {
        availableColors: string[];
        selectedColors: string[];
        setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
        
        basePrice: string;
        setBasePrice: React.Dispatch<React.SetStateAction<string>>;
        discount: string;
        setDiscount: React.Dispatch<React.SetStateAction<string>>;
        finalPrice: string;
        setFinalPrice: React.Dispatch<React.SetStateAction<string>>;
        
        colorOptions: string[];
        showColorDropDown: boolean;
        setShowColorDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        
        handleAddColor: (color: string) => void;
        handleRemoveColor: (index: number) => void;
        calculateFinalPrice: () => void;
        
        validationErrors: {
            colors: string;
            basePrice: string;
        };
    };
};

export default IStepFiveBespokeShoeProps;