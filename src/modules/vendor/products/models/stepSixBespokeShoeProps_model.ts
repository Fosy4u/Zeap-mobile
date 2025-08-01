interface IStepSixBespokeShoeProps {
    manageState: {
        productSummary: {
            name: string;
            description: string;
            category: string;
            specifications: {
                main: string[];
                style: string[];
                gender: string[];
                ageGroup: string;
                ageRange: string;
                brand: string;
                design: string[];
                occasion: string[];
                soleType: string;
                closure: string[];
                fit: string[];
            };
            measurements: {
                footLength: string;
                footWidth: string;
                instepHeight: string;
                heelWidth: string;
                archType: string;
                toeLength: string;
                isCustom: boolean;
            };
            images: any[];
            colors: string[];
            pricing: {
                basePrice: string;
                discount: string;
                finalPrice: string;
            };
        };
        
        additionalNotes: string;
        setAdditionalNotes: React.Dispatch<React.SetStateAction<string>>;
        
        isPublish: boolean;
        setIsPublish: React.Dispatch<React.SetStateAction<boolean>>;
        
        isSubmitting: boolean;
        setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
        
        handleSubmitProduct: () => Promise<void>;
        handleSaveAsDraft: () => Promise<void>;
    };
};

export default IStepSixBespokeShoeProps;