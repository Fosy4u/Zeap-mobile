import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {Add, DocumentUpload} from "iconsax-react-native";

interface ImageFile {
    uri: string;
    size: number;
    type: string;
};
interface IProps {
    selectedImages: ImageFile[];
    handleAddImage: any;
    handleRemoveImage: any;
};

const StepFourComponent: React.FC<IProps> = ({ selectedImages, handleAddImage, handleRemoveImage }) => {
    const [isDefaultImage, setIsDefaultImage] = useState(false);

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 4: Product Image(s)</Text>
            <Text className="mt-2 font-montserratMedium">Provide the product image(s) for this product.</Text>

            <Text aria-label="ColourName" nativeID="colourName" className="mt-6 font-montserratMedium">Upload image for color black</Text>
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

            {/*==== Added Images ====*/}
            { selectedImages.length > 0 && (
                <View>
                    <View className="h-auto w-full mt-6 flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-baseGreen">Added images</Text>
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

                    {/* <View className="mt-4 flex-row items-center">
                        <CheckBox
                            value={ isDefaultImage }
                            onValueChange={ (newValue) => setIsDefaultImage(newValue) }
                            tintColors={{ true: "#133522", false: "#151518" }}
                        />
                        <Text className="font-montserratMedium">Set this as your default image option</Text>
                    </View> */}
                </View>
            ) }

        </View>
    )
}
export default StepFourComponent;
