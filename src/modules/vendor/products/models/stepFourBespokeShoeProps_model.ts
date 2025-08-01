interface IStepFourBespokeShoeProps {
    manageState: {
        images: any[];
        setImages: React.Dispatch<React.SetStateAction<any[]>>;
        selectedImages: any[];
        setSelectedImages: React.Dispatch<React.SetStateAction<any[]>>;
        isUploading: boolean;
        setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
        uploadProgress: number;
        setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
        
        handleImageSelection: () => void;
        handleImageUpload: () => Promise<void>;
        handleRemoveImage: (index: number) => void;
        
        validationError: string;
    };
};

export default IStepFourBespokeShoeProps;