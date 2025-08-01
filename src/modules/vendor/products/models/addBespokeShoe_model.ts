interface IBespokeShoeState {
    currentStep: number;
    
    // Step One - Basic Information
    productName: string;
    productDescription: string;
    productCategory: string;
    
    // Step Two - Specifications
    selectedMain: string[];
    selectedStyle: string[];
    selectedGender: string[];
    selectedAgeGroup: string;
    selectedAgeRange: string;
    selectedBrand: string;
    selectedDesign: string[];
    selectedOccasion: string[];
    selectedSoleType: string;
    selectedClosure: string[];
    selectedFit: string[];
    
    // Step Three - Measurements
    selectedFootLength: string;
    selectedFootWidth: string;
    selectedInstepHeight: string;
    selectedHeelWidth: string;
    selectedArchType: string;
    selectedToeLength: string;
    customFootLength: string;
    customFootWidth: string;
    customInstepHeight: string;
    customHeelWidth: string;
    customToeLength: string;
    isCustomMeasurement: boolean;
    
    // Step Four - Images
    images: any[];
    selectedImages: any[];
    
    // Step Five - Colors and Pricing
    selectedColors: string[];
    basePrice: string;
    discount: string;
    finalPrice: string;
    
    // Step Six - Submission
    additionalNotes: string;
    isPublish: boolean;
}

interface IAddBespokeShoeHook {
    state: IBespokeShoeState;
    
    // Navigation Functions
    handleNext: () => void;
    handleBack: () => void;
    handleStepPress: (step: number) => void;
    
    // Step Management
    validateCurrentStep: () => boolean;
    getCurrentStepComponent: () => JSX.Element;
    
    // Submission Functions
    handleSubmitProduct: () => Promise<void>;
    handleSaveAsDraft: () => Promise<void>;
    
    // UI State
    isLoading: boolean;
    isSubmitting: boolean;
}

export { IBespokeShoeState, IAddBespokeShoeHook };