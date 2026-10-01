import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Add} from "iconsax-react-native";
import FastImage from 'react-native-fast-image';
import ColorSwatchChipComponent from "../colorSwatchChip_component";

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
    selectedColor: IColorOption[];
    handleSelectColour: (colour: IColorOption) => void;
    handleGetTextColor: (hex: string) => string;
    uploadedColorAndImages: UploadedColorAndImage[];
    handleDeleteColor: (selectedColor: string) => void;
    handleDeleteUploadedImage: (colorName: string, imageName: string) => void;
    handleAddMoreImages: (colour: IColorOption) => void;
    setSelectedDefaultImage: (image: UploadedImageFile) => void;
    setShowDefaultImageModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const StepFourComponent: React.FC<IProps> = (props) => {
    const {
        uploadedColorAndImages, colorOptions, selectedColor, handleSelectColour, handleGetTextColor,
        handleDeleteColor, handleDeleteUploadedImage, handleAddMoreImages, setSelectedDefaultImage, setShowDefaultImageModal,
    } = props;

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 4: Product Image(s)</Text>
            <Text className="mt-2 font-montserratMedium">Select a colour, add its images and tap Upload. Repeat for each colour, then Save & Continue.</Text>

            <View>
                <Text className="mt-6 font-montserratSemiBold text-xs text-gray-700">Colour</Text>
                <Text className="font-montserratMedium text-xs text-gray-700">Select a colour</Text>
                <ScrollView
                    horizontal={ true }
                    showsHorizontalScrollIndicator={ false }
                >
                    <View className="h-auto w-full mt-3 flex-row items-center gap-x-1">
                        { colorOptions.map((color, index) => {
                            const isSelected = selectedColor.some((c) => c.colorCode === color.colorCode);
                            return (
                                <TouchableOpacity onPress={ () => handleSelectColour(color) } key={index}>
                                    <ColorSwatchChipComponent
                                        colorName={ color.colorName }
                                        colorCode={ color.colorCode }
                                        className={ isSelected ? "border-2 border-baseGreen" : "border-2 border-gray-300" }
                                    />
                                </TouchableOpacity>
                            );
                        }) }
                    </View>
                </ScrollView>

            </View>


            {/*==== Uploaded Images ====*/}
            { uploadedColorAndImages.length > 0 && (
                <View>
                    <Text className="mt-5 font-montserratSemiBold text-baseGreen">Uploaded colors and images</Text>
                    
                    { uploadedColorAndImages.map((colorAndImage, index) => (
                        <View key={ index } className="h-auto w-full mt-2 p-4 rounded-lg border border-gray-200">
                            <Text className="font-montserratMedium text-baseGreen">Color</Text>
                            <View className="h-auto w-full mt-2 flex-row items-center justify-start gap-x-2">
                                <View className="h-[25px] w-[25px] rounded-full border border-gray-300" style={{ backgroundColor:colorAndImage.color?.colorCode }} />
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
                                    { colorAndImage.images.map((image, index) => (
                                        <TouchableOpacity
                                            onLongPress={ () => {
                                                setSelectedDefaultImage(image);
                                                setShowDefaultImageModal(true);
                                            } }
                                            key={ index }
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
                                            <TouchableOpacity onPress={ () => handleDeleteUploadedImage(colorAndImage.color?.colorName!, image.name!) } className="h-[22px] w-[22px] absolute -top-2 -right-2 text-baseGreen rounded-full bg-gray-200 rotate-45 z-10">
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
                                    onPress={ () => handleAddMoreImages(colorAndImage.color!) }
                                    className="px-3 py-2.5 text-baseGreen rounded-lg bg-green-100"
                                >
                                    <Text className="text-xs text-baseGreen">Add More Images</Text>
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
