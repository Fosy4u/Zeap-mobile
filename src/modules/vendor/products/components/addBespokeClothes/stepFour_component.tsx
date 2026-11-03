import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Add, DocumentUpload, InfoCircle} from "iconsax-react-native";
import FastImage from 'react-native-fast-image';

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
interface IProps {
    selectedImages: ImageFile[];
    uploadedImages: UploadedImageFile[];
    handleAddImage: () => void;
    handleRemoveImage: (index: number) => void;
    handleDeleteImage: (index: number) => void;
    setSelectedDefaultImage: (image: UploadedImageFile) => void;
    setShowDefaultImageModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const StepFourComponent: React.FC<IProps> = (IProps) => {
    const { selectedImages, uploadedImages, handleAddImage, handleRemoveImage, handleDeleteImage, setSelectedDefaultImage, setShowDefaultImageModal } = IProps;  

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 4: Product Image(s)</Text>
            { uploadedImages.length === 0 && (
                <View className="h-auto w-full mt-3 p-4 flex-row rounded-xl bg-blue-50">
                    <InfoCircle size={ 20 } color="#2563eb" variant="Bold" />
                    <Text className="flex-1 ml-3 font-montserratMedium text-xs text-blue-700 leading-5">
                        No images found for this product. You can start by adding one below.
                    </Text>
                </View>
            ) }

            <Text aria-label="ColourName" nativeID="colourName" className="mt-6 font-montserratMedium">Upload clothe images</Text>
            <TouchableOpacity
                onPress={ () => handleAddImage() }
                className="h-auto w-full mt-1.5 px-3 py-5 flex-col items-center rounded-xl bg-gray-50"
                style={{ borderWidth: 2, borderColor: "#e5e7eb", borderStyle: "dotted" }}
            >
                <DocumentUpload size={ 24 } className="text-baseGreen" />
                <Text className="mt-4 font-montserratMedium text-gray-700"><Text className="text-green-600">Click here</Text> to upload file</Text>
                <Text className="mt-3 font-montserratMedium text-xs text-gray-400">Must not exceed 5 images (Max: 1MB/image)</Text>
                <Text className="font-montserratMedium text-xs text-gray-400">Allowed format - JPG, PNG.</Text>
            </TouchableOpacity>

            {/*==== Selected Images ====*/}
            { selectedImages.length > 0 && (
                <View>
                    <View className="h-auto w-full mt-6 flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-baseGreen">Selected images</Text>
                        <Text>{ selectedImages.length } / 5</Text>
                    </View>
                    <View className="h-auto w-full mt-2 flex-row flex-wrap items-center gap-x-3">
                        { selectedImages.map((image, index) => (
                            <View
                                key={ index }
                                className="h-16 w-20 mt-3 p-0 relative flex items-center justify-center rounded-lg border border-gray-400 bg-gray-200"
                            >
                                <FastImage
                                    source={ { uri: image?.uri! } }
                                    resizeMode="contain"
                                    className="h-[63px] w-[79px] absolute inset-0 border border-transparent rounded-lg"
                                />
                                <TouchableOpacity onPress={ () => handleRemoveImage(index) } className="h-[22px] w-[22px] absolute -top-2 -right-2 text-baseGreen rounded-full bg-gray-200 rotate-45 z-10">
                                    <Add size={22} className="text-baseGreen" />
                                </TouchableOpacity>
                            </View>
                        )) }
                    </View>
                </View>
            ) }


            {/*==== Uploaded Images ====*/}
            { uploadedImages.length > 0 && (
                <View>
                    <View className="h-auto w-full mt-6 flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-baseGreen">Uploaded images</Text>
                        <Text>{ uploadedImages.length } / 5</Text>
                    </View>
                    <View className="h-auto w-full mt-2 flex-row flex-wrap items-center gap-x-7">
                        { uploadedImages.map((image, index) => (
                            <View key={ index } className="items-center">
                            <TouchableOpacity
                                onLongPress={ () => {
                                    setSelectedDefaultImage(image);
                                    setShowDefaultImageModal(true);
                                } }
                                className="h-16 w-20 mt-3 p-0 relative flex items-center justify-center rounded-lg border border-gray-400 bg-gray-200"
                            >
                                <FastImage
                                    source={ { uri: image?.uri! } }
                                    resizeMode="contain"
                                    className="h-[63px] w-[79px] absolute inset-0 border border-transparent rounded-lg"
                                />
                                <TouchableOpacity onPress={ () => handleDeleteImage(index) } className="h-[22px] w-[22px] absolute -top-2 -right-2 text-baseGreen rounded-full bg-gray-200 rotate-45 z-10">
                                    <Add size={22} className="text-baseGreen" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            { image?.isDefault ? (
                                <View className="w-20 mt-1.5 py-1 items-center rounded-md bg-baseGreen">
                                    <Text className="font-montserratMedium text-[10px] text-white">Default</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={ () => {
                                        setSelectedDefaultImage(image);
                                        setShowDefaultImageModal(true);
                                    } }
                                    className="w-20 mt-1.5 py-1 items-center rounded-md border border-baseGreen bg-white"
                                >
                                    <Text className="font-montserratMedium text-[10px] text-baseGreen">Set Default</Text>
                                </TouchableOpacity>
                            ) }
                            </View>
                        )) }
                    </View>
                </View>
            ) }

        </View>
    )
}
export default StepFourComponent;
