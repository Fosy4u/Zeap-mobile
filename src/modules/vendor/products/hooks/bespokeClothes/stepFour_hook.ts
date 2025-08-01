import { useEffect, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useDeleteProductImageMutation, useSetDefaultProductImageMutation, useUpdateProductImagesMutation, useUploadProductImagesMutation } from "../../apis/bespokeProduct_api";
import { useLazyGetProductByProductIDQuery } from "../../apis/product_api";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import IVendorProductDetails from "../../models/vendorProductDetails_model";


interface ImageFile {
    uri: string | undefined;
    name: string | undefined;
    type: string | undefined;
    size: number | undefined;
};
interface UploadedImageFile {
    uri: string | undefined;
    name: string | undefined;
    type: string | undefined;
    size: number | undefined;
    isDefault: boolean | undefined;
};

const useStepFourHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImageFile[]>([]);
    const [selectedDefaultImage, setSelectedDefaultImage] = useState<UploadedImageFile>({} as UploadedImageFile);
    const [showDefaultImageModal, setShowDefaultImageModal] = useState(false);
    const dispatch = useDispatch();

    const [uploadProductImages] = useUploadProductImagesMutation();
    const [updateProductImages] = useUpdateProductImagesMutation();
    const [setDefaultProductImage] = useSetDefaultProductImageMutation();
    const [deleteProductImage] = useDeleteProductImageMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();

    // Request gallery permissions for Android
    const requestPermission = async () => {
        if (Platform.OS !== 'android') return true;
        
        try {
            // Check if we already have permission
            const permission = Platform.Version >= 33
                ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
                
            const hasPermission = await PermissionsAndroid.check(permission);
            if (hasPermission) return true;
            
            // Request permission if we don't have it
            const granted = await PermissionsAndroid.request(permission, {
                title: 'Gallery Permission',
                message: 'App needs access to your gallery to select images.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    // Handle add image.
    const handleAddImage = async () => {
        // Check total number of images
        if (selectedImages.length >= 5) {
            Alert.alert("Limit Reached", "You can only upload up to 5 images.");
            return;
        }

        // Request for gallery permissions
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            Alert.alert("Permission Required", "Please allow access to your gallery to select images.");
            return;
        }

        // Set image picker options
        const options: ImageLibraryOptions = {
            mediaType: "photo",
            quality: 1,
            includeBase64: false,
            selectionLimit: 5 - selectedImages.length,
        };

        // Launch the image picker
        launchImageLibrary(options, (response) => {

            if (response.didCancel) {
                return;
            }

            if (response.errorCode) {
                Alert.alert("Error", response.errorMessage);
                return;
            }

            const selectedImageAssets = response.assets || [];
            const validImages: any[] = [];

            selectedImageAssets.forEach((asset) => {

                // Check file size (Max: 1MB = 1048576 bytes)
                const fileSize = asset.fileSize;
                if (fileSize && fileSize > 1048576) {
                    Alert.alert("File Too Larger", "Each image must not exceed 1MB.");
                    return;
                }

                // Check file type (Only JPEG, JPG, PNG)
                const fileType = asset.type;
                if (fileType !== "image/jpeg" && fileType !== "image/png" && fileType !== "image/jpg") {
                    Alert.alert("Error", "Only JPEG, JPG and PNG files are allowed.");
                    return;
                }

                let filename = asset?.uri?.split('/').pop() ?? '';
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
          
                validImages.push({
                    uri: asset.uri,
                    name: filename,
                    type: type
                  });
            });

            if (validImages.length > 0) {
                setSelectedImages(prevState => [...prevState, ...validImages]);                
            }
        });
    };

    // Handle remove image
    const handleRemoveImage = (index: number) => {
        setSelectedImages(prevState => prevState.filter((_, i) => i !== index));
    };

    // Handle upload image
    const handleUploadImage = async () => {
        dispatch(setLoadingMessage("Uploading product image..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            // Check if there are images to upload
            if (selectedImages.length === 0 && uploadedImages.length === 0) {
                Alert.alert("Error", "Please select at least one image to upload.");
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                return;
            }
            if (selectedImages.length === 0 && uploadedImages.length > 0) {
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setSelectedStep(5));
                return;
            }

            // Create a FormData instance
            const formData = new FormData();
            
            formData.append("productId", productId);
            formData.append("color", "Bespoke");
            formData.append("currentStep", 4);

            selectedImages.forEach((image: ImageFile, index: number) => {
                const imageUri = image.uri;
                const imageName = image.name || `image_${index}.jpg`;
                const imageType = image.type || "image/jpeg";

                formData.append("images", {
                    uri: imageUri,
                    name: imageName,
                    type: imageType,
                });
            });
            
            let uploadProductImagesResponseData: IVendorProductDetails | undefined;
            if (selectedImages.length > 0 && uploadedImages.length === 0) {
                uploadProductImagesResponseData = await uploadProductImages(formData).unwrap();
            }
            if (selectedImages.length > 0 && uploadedImages.length > 0) {
                uploadProductImagesResponseData = await updateProductImages(formData).unwrap();
            }
            // console.log("RESPONSE DATA: ", uploadProductImagesResponseData);

            if (uploadProductImagesResponseData) {
                setSelectedImages([]);
                
                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(5));
                }
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            Alert.alert("Error", error.errors[0]);
            console.log("ERROR: ", error);
        }
    };

    // Handle delete image
    const handleDeleteImage = async (index: number) => {
        
        if (product.colors?.[0].images?.[index]) {
            dispatch(setLoadingMessage("Deleting product image..."));
            dispatch(setProductIsLoading(true));

            const productId = product?.productId || "";
            const imageName = uploadedImages[index].name || "";
            const color = "Bespoke";

            try {
                const deleteProductImageResponseData = await deleteProductImage({ productId, imageName, color }).unwrap();
                console.log("DELETE PRODUCT IMAGE RESPONSE: ", deleteProductImageResponseData);

                if (deleteProductImageResponseData) {
                    const updatedProduct = await getProductByProductID(productId).unwrap();

                    if (updatedProduct) {
                        dispatch(setProduct(updatedProduct));
                        dispatch(setProductIsLoading(false));
                        dispatch(setLoadingMessage(""));
                    }
                }
            } catch (error) {
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                console.log("ERROR: ", error);
            }
        } else {
            setSelectedImages(prevState => prevState.filter((_, i) => i !== index));
        }
    };

    // Handle set uploaded images from draft product
    const handleSetUploadedImagesFromDraftProduct = () => {
        if (!product) return;

        const productImages = product.colors?.[0].images || [];

        // Format selected images
        const formattedSelectedImages = productImages.map((image) => ({
            uri: image?.link,
            name: image?.name,
            type: image?.name?.split(".")[1],
            size: 0,
            isDefault: image?.isDefault,
        }));
        // console.log("FORMATTED SELECTED IMAGES", formattedSelectedImages);
        
        setUploadedImages(formattedSelectedImages);
    };

    // Handle set default image
    const handleSetDefaultImage = async () => {
        if (!selectedDefaultImage) return;

        dispatch(setLoadingMessage("Setting default product image..."));
        dispatch(setProductIsLoading(true));

        const productId = product?.productId || "";
        const imageName = selectedDefaultImage.name || "";
        const color = "Bespoke";
        console.log("REQUEST DATA: ", { productId, imageName, color });
        
        try {
            const setDefaultProductImageResponseData = await setDefaultProductImage({ productId, imageName, color }).unwrap();
            console.log("SET DEFAULT PRODUCT IMAGE RESPONSE: ", JSON.stringify(setDefaultProductImageResponseData));

            if (setDefaultProductImageResponseData) {
                setShowDefaultImageModal(false);
                dispatch(setProduct(setDefaultProductImageResponseData));
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            setShowDefaultImageModal(false);
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            console.log("ERROR: ", error);
        }
    };

    useEffect(() => {
        handleSetUploadedImagesFromDraftProduct();
    }, [product]);


    return {
        selectedImages, handleAddImage, handleRemoveImage, handleUploadImage,
        uploadedImages, handleDeleteImage,
        setSelectedDefaultImage, showDefaultImageModal, setShowDefaultImageModal, handleSetDefaultImage,
    };
};

export default useStepFourHook;