interface IStepOneBespokeShoeProps {
    manageState: {
        productName: string;
        setProductName: React.Dispatch<React.SetStateAction<string>>;
        productDescription: string;
        setProductDescription: React.Dispatch<React.SetStateAction<string>>;
        productCategory: string;
        setProductCategory: React.Dispatch<React.SetStateAction<string>>;
        
        categoryOptions: string[];
        showCategoryDropDown: boolean;
        setShowCategoryDropDown: React.Dispatch<React.SetStateAction<boolean>>;
        
        validationErrors: {
            productName: string;
            productDescription: string;
            productCategory: string;
        };
    };
};

export default IStepOneBespokeShoeProps;