import { useEffect, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Asset, ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useUploadProductImagesMutation } from "../../apis/bespokeProduct_api";
import { ur } from "intl-tel-input/i18n";
import { getSavedAnonymousToken } from "../../../../../redux/services/authorizationHeader";


interface ImageFile {
    uri: string;
    name: string;
    type: string;
    size: number;
};

const useStepFourHook = () => {

    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState );
    const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
    const [loadingMessage, setLoadingMessage] = useState("");

    const [uploadProductImages, { isLoading, isSuccess }] = useUploadProductImagesMutation();

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

    // Handle the add image.
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

    // Handle the remove image.
    const handleRemoveImage = (index: number) => {
        setSelectedImages(prevState => prevState.filter((_, i) => i !== index));
    };


    // Handle the upload image.
    // const handleUploadImage = async () => {
    //     setLoadingMessage("Updating body measurements...");
    //     const productId = selectedDraftProduct?.productId || "";

    //     // try {
    //         // Check if there are images to upload
    //         if (selectedImages.length === 0) {
    //             Alert.alert("Error", "Please select at least one image to upload.");
    //             setLoadingMessage("");
    //             return;
    //         }

    //         // Create a FormData instance
    //         const formData = new FormData();
            
    //         // formData.append("productId", productId);
    //         // formData.append("color", "Bespoke");

    //         let i = 0;

    //         // selectedImages.forEach((image: ImageFile) => {
    //         //     formData.append("images[" + i + "]", image as any);

    //         //     i ++;
    //         // });
    //         console.log(selectedImages[0])
    //         // formData.append("images", selectedImages[0]);
            
    //         // const uploadProductImagesResponseData = await fetch('https://zeap-api.onrender.com/product/update/addColorAndImages', {
    //         //     method: 'PUT',
    //         //     body: new URLSearchParams(formData),
    //         //     headers: {
    //         //         "Content-Type": "application/x-www-form-urlencoded",
    //         //         "Authorization": `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vemVhcC03ZGUzZCIsImF1ZCI6InplYXAtN2RlM2QiLCJhdXRoX3RpbWUiOjE3NDI0NTYzMDYsInVzZXJfaWQiOiJvQlBGdkJNcmhiY3JSRGJkRnU1R20xNUY0bzgzIiwic3ViIjoib0JQRnZCTXJoYmNyUkRiZEZ1NUdtMTVGNG84MyIsImlhdCI6MTc0MjY4MDk1MiwiZXhwIjoxNzQyNjg0NTUyLCJlbWFpbCI6InNvYmFyNDc4MDdAcGF4bncuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNvYmFyNDc4MDdAcGF4bncuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.sxyPE6iXO_kl83YO4Se6-YFDpf09VvZoOvoeRxCfqpFZkEahVIL0XMjW3Lg4iedTQnk8YC5D129Zlqy6qFmFHUNlgLNWPTbFHiGlWFWgnwKX8lb0SnS4cbvJ4FW1rCarH_d9x5_UQQN9oq6VpFFo-Wjpcas7rWbHFfmoos5D2zHJQE_8P683AIfD1hNHpZmOgYtJF7SYWgUoYypY17Goiw15x4n-wgO7n2ku9tnlKlioLhDaqAPusoqwMuJtpVP_drV3tkzEAf8D6magRYWxJRQwtsNuPEcvfvE1FgeKuiniTqg1XVZe5-J3noup56jDjbEdfAJ_LVeQBe5Mdc7dJg`,
    //         //     },
    //         // })
    //         // .then((response) => response.json())
    //         // .then((response) => {
    //         //         setLoadingMessage("");
    //         //         console.log("RESPONSE: ", response);
    //         // })
    //         // .catch((error) => {
    //         //     console.log("ERROR: ", error);
    //         // });
            
    //         await uploadProductImages({
    //             body: formData
    //         })
    //             .unwrap()
    //             .then((response) => {
    //                 setLoadingMessage("");
    //             })
    //             .catch((error) => {
    //                 console.log("ERROR: ", error);
    //             });

    //         // if (uploadProductImagesResponseData) {
    //         // }
    //     // } catch (error) {
    //     //     console.log("ERROR: ", error);
    //     // }
    // };

    const handleUploadImage = async () => {
        setLoadingMessage("Updating body measurements...");
        const productId = selectedDraftProduct?.productId || "";

        try {
            // Check if there are images to upload
            if (selectedImages.length === 0) {
                Alert.alert("Error", "Please select at least one image to upload.");
                setLoadingMessage("");
                return;
            }

            // Create a FormData instance
            const formData = new FormData();
            
            formData.append("productId", productId);
            formData.append("color", "Bespoke");

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

            const uploadProductImagesResponseData = await uploadProductImages(formData).unwrap();
            console.log("RESPONSE DATA: ", uploadProductImagesResponseData);

            if (uploadProductImagesResponseData) {
                setLoadingMessage("");
            }
        } catch (error) {
            console.log("ERROR: ", error);
        }
    };

    return {
        isLoading, isSuccess, loadingMessage,
        selectedImages, handleAddImage, handleRemoveImage, handleUploadImage,
    };
};

export default useStepFourHook;