import { useEffect, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import IVendorProductDetails from "../../models/vendorProductDetails_model";
import { IColorEnum } from "../../../../general/models/productOptions_model";
import {
    useDeleteProductColorMutation,
    useDeleteProductImageMutation, useLazyGetProductByProductIDQuery, useSetDefaultProductImageMutation,
    useUpdateProductImagesMutation, useUploadProductImagesMutation
} from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";


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
interface UploadedColorAndImage {
    color: IColorOption | undefined;
    images: UploadedImageFile[];
};
interface IColorOption {
    colorName: string;
    colorCode: string;
};

const useStepFourHook = () => {

    const { accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
    const [uploadedColorAndImages, setUploadedColorAndImages] = useState<UploadedColorAndImage[]>([]);
    const [selectedDefaultImage, setSelectedDefaultImage] = useState<UploadedImageFile>({} as UploadedImageFile);
    const [showDefaultImageModal, setShowDefaultImageModal] = useState(false);
    const [colorOptions, setColorOptions] = useState<IColorOption[]>([]);
    const [selectedColor, setSelectedColor] = useState<IColorOption[]>([]);
    // Controls the per-colour image-upload modal (opens when a colour is picked).
    const [showImageUploadModal, setShowImageUploadModal] = useState(false);
    // The colour currently being deleted — drives the per-card delete spinner so
    // only the card being removed spins (not every uploaded colour).
    const [deletingColorName, setDeletingColorName] = useState<string>("");
    const dispatch = useDispatch();

    const [uploadProductImages] = useUploadProductImagesMutation();
    const [updateProductImages] = useUpdateProductImagesMutation();
    const [setDefaultProductImage] = useSetDefaultProductImageMutation();
    const [deleteProductColor] = useDeleteProductColorMutation();
    const [deleteProductImage] = useDeleteProductImageMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();


    // Handle format product colours
    const handleFormatProductColours = () => {
        if (!accessoriesOptions) return;

        const formattedColours: IColorOption[] = accessoriesOptions.colorEnums!.map((colour: IColorEnum) => ({
            colorName: colour.name || "",
            colorCode: colour.hex || "",
        }));
        setColorOptions(formattedColours);
    };

    // Handle selecting colour — single active colour at a time. Tapping a new
    // colour switches to it (and clears any images picked for the previous
    // one); tapping the active colour again deselects it. The active colour is
    // what the uploader and "Selected colour" indicator reflect.
    const handleSelectColour = (colour: IColorOption) => {

        // Check if the selected color already exist in the uploaded color and images
        const isColorAlreadySelected = uploadedColorAndImages.find((colorAndImage) => colorAndImage.color?.colorName === colour.colorName);
        if (isColorAlreadySelected) {
            Alert.alert("Error", "This color is already selected.");
            return;
        }

        // Activate the colour and open the upload modal for it. Images are
        // reset so the modal starts empty for this colour.
        setSelectedColor([colour]);
        setSelectedImages([]);
        setShowImageUploadModal(true);
    };

    // Close the modal and clear the in-progress colour/images (cancel).
    const handleCloseImageUploadModal = () => {
        setShowImageUploadModal(false);
        setSelectedColor([]);
        setSelectedImages([]);
    };

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

    // Upload the ACTIVE colour and its images via /product/update/addColorAndImages.
    // Stays on step 4 and resets the selection so the vendor can add the next
    // colour (select colour → add images → Upload → repeat → Save & Continue).
    const handleUploadColorAndImages = async () => {
        // Require an active colour and at least one image for it.
        if (selectedColor.length === 0) {
            Alert.alert("Select a colour", "Please select a colour before uploading images.");
            return;
        }
        if (selectedImages.length === 0) {
            Alert.alert("Add an image", "Please add at least one image for the selected colour.");
            return;
        }

        dispatch(setLoadingMessage("Uploading colour and images..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            // Create a FormData instance
            const formData = new FormData();

            formData.append("productId", productId);
            formData.append("color", selectedColor[0].colorName);
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

            // New colour → add; an existing one → append to it.
            let uploadProductImagesResponseData: IVendorProductDetails | undefined;
            const isColorAlreadySelected = uploadedColorAndImages.find((colorAndImage) => colorAndImage.color?.colorName === selectedColor[0].colorName);
            if (isColorAlreadySelected) {
                uploadProductImagesResponseData = await updateProductImages(formData).unwrap();
            } else {
                uploadProductImagesResponseData = await uploadProductImages(formData).unwrap();
            }

            if (uploadProductImagesResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));

                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    // Reset and close the modal so the vendor returns to the
                    // main screen and can pick the next colour.
                    setShowImageUploadModal(false);
                    setSelectedColor([]);
                    setSelectedImages([]);
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                }
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };

    // Save & Continue — requires at least one uploaded colour, then advances.
    const handleProceedToNextStep = () => {
        if (uploadedColorAndImages.length === 0) {
            Alert.alert("Add a colour", "Please upload at least one colour with its images before continuing.");
            return;
        }
        dispatch(setSelectedStep(5));
    };

    // Handle delete color
    const handleDeleteColor = async (selectedColor: string) => {
        dispatch(setLoadingMessage("Deleting product color and their images..."));
        dispatch(setProductIsLoading(true));
        setDeletingColorName(selectedColor);
        const productId = product?.productId || "";

        try {
            const requestData = {
                color: selectedColor,
                productId,
            };

            const deleteProductColorResponseData = await deleteProductColor(requestData).unwrap();

            if (deleteProductColorResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));

                const updatedProduct = await getProductByProductID(productId).unwrap();

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            setDeletingColorName("");
        };
    };

    // Delete a single already-uploaded image from a colour via
    // /product/update/deleteProductImage ({ productId, color, imageName }).
    const handleDeleteUploadedImage = async (colorName: string, imageName: string) => {
        if (!colorName || !imageName) return;

        dispatch(setLoadingMessage("Deleting product image..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            const deleteProductImageResponseData = await deleteProductImage({ productId, color: colorName, imageName }).unwrap();

            if (deleteProductImageResponseData) {
                const updatedProduct = await getProductByProductID(productId).unwrap();
                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Open the upload modal for an already-uploaded colour to add more images.
    // Skips the "already selected" guard in handleSelectColour on purpose — the
    // upload then routes to /product/update/addImagesToProductColor.
    const handleAddMoreImages = (colour: IColorOption) => {
        setSelectedColor([colour]);
        setSelectedImages([]);
        setShowImageUploadModal(true);
    };

    // Handle set uploaded images from draft product
    const handleSetUploadedImagesFromDraftProduct = () => {
        if (!product) return;

        const productColors = product.colors! || [];

        // Loop through the "productColors" and format.
        const formattedUploadedColorAndImage: UploadedColorAndImage[] = productColors.map((color) => {

            // Selected color
            const colorName = color?.value! || "";
            const selectedColor = colorOptions && colorOptions.find((color) => color.colorName === colorName);

            // Format selected images
            const productImages = color?.images || [];
            const formattedSelectedImages = productImages.map((image) => ({
                uri: image?.link,
                name: image?.name,
                type: image?.name?.split(".")[1],
                size: 0,
                isDefault: image?.isDefault,
            }));

            return {
                color: selectedColor,
                images: formattedSelectedImages,
            };
        });

        setUploadedColorAndImages(formattedUploadedColorAndImage);
    };

    // Handle set default image
    const handleSetDefaultImage = async () => {
        if (!selectedDefaultImage) return;

        dispatch(setLoadingMessage("Setting default product image..."));
        dispatch(setProductIsLoading(true));

        const productId = product?.productId || "";
        const imageName = selectedDefaultImage.name || "";
        const color = selectedColor[0]?.colorName || "";

        try {
            const setDefaultProductImageResponseData = await setDefaultProductImage({ productId, imageName, color }).unwrap();

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
            handleError(error);
        }
    };

    useEffect(() => {
        if (accessoriesOptions?.colorEnums) {
            handleFormatProductColours();
        }
    }, [accessoriesOptions]);
    useEffect(() => {
        handleSetUploadedImagesFromDraftProduct();
    }, [product, colorOptions]);


    return {
        colorOptions, handleSelectColour, selectedColor,
        selectedImages, handleAddImage, handleRemoveImage,
        handleUploadColorAndImages, handleProceedToNextStep,
        showImageUploadModal, handleCloseImageUploadModal, handleAddMoreImages,
        uploadedColorAndImages, handleDeleteColor, handleDeleteUploadedImage, deletingColorName,
        setSelectedDefaultImage, showDefaultImageModal, setShowDefaultImageModal, handleSetDefaultImage,
    };
};

export default useStepFourHook;
