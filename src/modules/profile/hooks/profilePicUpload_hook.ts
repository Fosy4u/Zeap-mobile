import { useState } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from "react-native-image-picker";
import { RootState } from "../../../redux/store/store";
import { setUserData } from "../slices/profileState_slice";
import { showAppToast } from "../../general/slices/general_slice";
import handleError from "../../general/hooks/errorHandler_hook";
import { useUpdateUserProfilePicMutation } from "../apis/profile_api";
import requestCameraPermission, { alertImagePickerError } from "../../../utils/cameraPermission";

const MAX_FILE_SIZE_KB = 1120;

const useProfilePicUploadHook = () => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
    const [updateUserProfilePic, { isLoading: isUploadingProfilePic }] = useUpdateUserProfilePicMutation();

    const handlePickerResponse = (response: ImagePickerResponse) => {
        if (response.didCancel) return;
        if (response.errorCode) {
            alertImagePickerError(response.errorCode, response.errorMessage);
            return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) return;
        if ((asset.fileSize ?? 0) / 1024 > MAX_FILE_SIZE_KB) {
            Alert.alert("Image too large", "Selected file size is greater than 1MB. Please select a smaller file");
            return;
        }
        setSelectedImage(asset);
    };

    const pickerOptions = { mediaType: "photo" as const, maxWidth: 1024, maxHeight: 1024, quality: 0.8 as const };

    const handleTakePhoto = async () => {
        if (!(await requestCameraPermission("Zeaper needs access to your camera to take your profile photo."))) { return; }
        launchCamera({ ...pickerOptions, saveToPhotos: false }, handlePickerResponse);
    };

    const handleChooseProfilePic = () => {
        Alert.alert("Profile photo", "Choose where to get your photo from", [
            { text: "Take Photo", onPress: handleTakePhoto },
            { text: "Choose from Gallery", onPress: () => launchImageLibrary({ ...pickerOptions, selectionLimit: 1 }, handlePickerResponse) },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const handleCancelProfilePic = () => setSelectedImage(null);

    const handleSaveProfilePic = async () => {
        if (!selectedImage?.uri) return;
        const formData = new FormData();
        formData.append("file", {
            uri: selectedImage.uri,
            name: selectedImage.fileName || `profile_${ Date.now() }.jpg`,
            type: selectedImage.type || "image/jpeg",
        } as any);

        try {
            const updatedUser = await updateUserProfilePic(formData).unwrap();
            if (updatedUser) {
                dispatch(setUserData({ ...userData, ...updatedUser }));
            }
            setSelectedImage(null);
            dispatch(showAppToast({ title: "Profile photo updated", message: "User successfully updated." }));
        } catch (error) {
            handleError(error);
        }
    };

    return {
        selectedImage,
        isUploadingProfilePic,
        handleChooseProfilePic,
        handleCancelProfilePic,
        handleSaveProfilePic,
    };
};

export default useProfilePicUploadHook;
