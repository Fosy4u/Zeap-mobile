import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Add, ArrowRight, DocumentUpload} from "iconsax-react-native";
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
interface UploadedColorAndImage {
    color: IColorOption | undefined;
    images: UploadedImageFile[];
};
interface IColorOption {
    colorName: string;
    colorCode: string;
};
interface IProps {
    colorOptions: IColorOption[];
    selectedColor: IColorOption;
    setSelectedColor: (color: IColorOption) => void;
    handleSelectColour: (colour: IColorOption) => void;
    handleGetTextColor: (hex: string) => string;
    selectedImages: ImageFile[];
    uploadedColorAndImages: UploadedColorAndImage[];
    handleAddImage: () => void;
    handleRemoveImage: (index: number) => void;
    handleDeleteColor: (selectedColor: string) => void;
    handleDeleteImage: (colorIndex: number, imageIndex: number) => void;
    setSelectedDefaultImage: (image: UploadedImageFile) => void;
    setShowDefaultImageModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleUploadImage: () => void;
};

const StepFourComponent: React.FC<IProps> = (props) => {
    const {
        selectedImages, uploadedColorAndImages, colorOptions, selectedColor, setSelectedColor, handleSelectColour, handleGetTextColor,
        handleAddImage, handleRemoveImage, handleDeleteColor, handleDeleteImage, setSelectedDefaultImage, setShowDefaultImageModal,
        handleUploadImage
    } = props;  

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 4: Product Image(s)</Text>
            <Text className="mt-2 font-montserratMedium">Provide the product image(s) for any selected color.</Text>

            <View>
                <Text className="mt-6 font-montserratSemiBold text-xs text-gray-700">Colour</Text>
                <Text className="font-montserratMedium text-xs text-gray-700">Select a colour</Text>
                <ScrollView
                    horizontal={ true }
                    showsHorizontalScrollIndicator={ false }
                >
                    <View className="h-auto w-full mt-3 flex-row items-center gap-x-1">
                        { colorOptions.map((color, index) => (
                            <TouchableOpacity onPress={ () => handleSelectColour(color) } key={index}>
                                <View className="h-auto w-16 py-2.5 rounded-lg" style={{ backgroundColor: color.colorCode }}>
                                    <Text className={`text-xs text-center ${handleGetTextColor(color.colorCode)}`}>{ color.colorName }</Text>
                                </View>
                            </TouchableOpacity>
                        )) }
                    </View>
                </ScrollView>

                { selectedColor.colorName && (
                    <View>
                        <Text className="mt-6 font-montserratSemiBold text-xs text-gray-700">Selected Color</Text>
                        <View className="h-auto w-full mt-2 flex-row items-center justify-start gap-x-2">
                            <View className="h-[25px] w-[25px] rounded-full" style={{ backgroundColor: selectedColor.colorCode }} />
                        </View>
                    </View>
                ) }
            </View>

            {/*==== Selected Colors ====*/}
            { selectedColor.colorName && (
                <>
                    <Text aria-label="ColourName" nativeID="colourName" className="mt-6 font-montserratMedium">Upload image for color {selectedColor.colorName}</Text>
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
                </>
            )}

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
                                <Image
                                    source={ { uri: image.uri } }
                                    resizeMode="contain"
                                    className="h-[63px] w-[79px] absolute inset-0"
                                />
                                <TouchableOpacity onPress={ () => handleRemoveImage(index) } className="h-[22px] w-[22px] absolute -top-2 -right-2 text-baseGreen rounded-full bg-gray-200 rotate-45 z-10">
                                    <Add size={22} className="text-baseGreen" />
                                </TouchableOpacity>
                            </View>
                        )) }
                    </View>

                    {/*==== Upload Colors and Images Button ====*/}
                    <TouchableOpacity
                        onPress={ () => handleUploadImage() }
                        className="h-[55px] mt-5 flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="mr-2 font-montserratRegular text-base text-white">Upload Color and Images</Text>
                        <ArrowRight size={ 18 } className="text-white" />
                    </TouchableOpacity>
                </View>
            ) }


            {/*==== Uploaded Colors and Images ====*/}
            { uploadedColorAndImages.length > 0 && (
                <View>
                    <Text className="mt-5 font-montserratSemiBold text-baseGreen">Uploaded colors and images</Text>
                    
                    { uploadedColorAndImages.map((colorAndImage, colorIndex) => (
                        <View key={ colorIndex } className="h-auto w-full mt-2 p-4 rounded-lg border border-gray-200">
                            <Text className="font-montserratMedium text-baseGreen">Color</Text>
                            <View className="h-auto w-full mt-2 flex-row items-center justify-start gap-x-2">
                                <View className="h-[25px] w-[25px] rounded-full" style={{ backgroundColor:colorAndImage.color?.colorCode }} />
                                <Text className="font-montserratMedium">{colorAndImage.color?.colorName }</Text>
                            </View>


                            <View className="h-auto w-full mt-6 flex-row items-center justify-between">
                                <Text className="font-montserratMedium text-baseGreen">Images</Text>
                                <Text>{ colorAndImage.images.length } / 5</Text>
                            </View>
                            <View className="h-auto w-full mt-2 flex-row items-center">
                                <ScrollView
                                    horizontal={ true }
                                    showsHorizontalScrollIndicator={ false }
                                    className="h-auto w-full pr-2"
                                >
                                    { colorAndImage.images.map((image, imageIndex) => (
                                        <TouchableOpacity
                                            onLongPress={ () => {
                                                setSelectedDefaultImage(image);
                                                setShowDefaultImageModal(true);
                                            } }
                                            key={ imageIndex }
                                            className="h-16 w-20 mt-3 mr-3 p-0 relative flex items-center justify-center rounded-lg border border-gray-400 bg-gray-200"
                                        >
                                            <FastImage
                                                source={ { uri: image.uri! } }
                                                resizeMode="contain"
                                                className="h-[63px] w-[79px] absolute inset-0 border border-transparent rounded-lg"
                                            />
                                            { image?.isDefault &&         
                                                <View className="absolute bottom-0 right-0 bg-lightGreen rounded-tl-md rounded-br-md px-1.5 py-0.5">
                                                <Text className="font-montserratMedium text-baseGreen text-[10px]">Default</Text>
                                                </View>
                                            }
                                            <TouchableOpacity onPress={ () => handleDeleteImage(colorIndex, imageIndex) } className="h-[22px] w-[22px] absolute -top-2 -right-2 text-baseGreen rounded-full bg-gray-200 rotate-45 z-10">
                                                <Add size={22} className="text-baseGreen" />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    )) }
                                </ScrollView>
                            </View>


                            <View className="h-auto w-full mt-5 flex-row justify-end space-x-2">
                                <TouchableOpacity
                                    onPress={ () => handleDeleteColor(colorAndImage.color?.colorName!) }
                                    className="px-3 py-2.5 text-baseGreen rounded-lg bg-red-50"
                                >
                                    <Text className="text-xs text-red-700">Delete Color</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={ () => {
                                        // handleSelectColour(colorAndImage.color!);
                                        setSelectedColor({
                                            colorName: colorAndImage.color?.colorName!,
                                            colorCode: colorAndImage.color?.colorCode!,
                                        });
                                        handleAddImage();
                                    } }
                                    className="px-3 py-2.5 text-baseGreen rounded-lg bg-green-100"
                                >
                                    <Text className="text-xs text-baseGreen">Add Images</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            ) }

        </View>
    )
}
export default StepFourComponent;
