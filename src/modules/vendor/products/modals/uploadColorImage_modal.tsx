import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Add, CloseCircle, DocumentUpload } from 'iconsax-react-native';

interface ImageFile {
    uri: string | undefined;
    name: string | undefined;
    type: string | undefined;
    size: number | undefined;
};

interface Props {
    colorName: string;
    colorCode: string;
    selectedImages: ImageFile[];
    handleAddImage: () => void;
    handleRemoveImage: (index: number) => void;
    handleUploadColorAndImages: () => void;
    isUploading: boolean;
    onClose: () => void;
};

// Per-colour image upload modal. Opens when a colour is selected on step 4:
// pick images → Upload → the API runs → on success the parent closes this modal
// and the colour appears on the main screen.
const UploadColorImageModal: React.FC<Props> = ({
    colorName,
    colorCode,
    selectedImages,
    handleAddImage,
    handleRemoveImage,
    handleUploadColorAndImages,
    isUploading,
    onClose,
}) => {

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar backgroundColor="gray" barStyle="dark-content" />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60" />

            <View className="w-[90%] max-h-[80%] rounded-2xl bg-white overflow-hidden">
                {/*==== Header ====*/}
                <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
                    <View className="flex-row items-center gap-x-2">
                        <View className="h-[22px] w-[22px] rounded-full border border-gray-200" style={{ backgroundColor: colorCode }} />
                        <Text className="font-montserratSemiBold text-base text-baseGreen">Upload { colorName } images</Text>
                    </View>
                    <TouchableOpacity onPress={ onClose } disabled={ isUploading }>
                        <CloseCircle size={ 26 } color="#133522" variant="Bold" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={{ padding: 16 }}>
                    {/*==== Image picker ====*/}
                    <TouchableOpacity
                        onPress={ () => handleAddImage() }
                        disabled={ isUploading }
                        className="h-auto w-full px-3 py-6 flex-col items-center rounded-xl bg-gray-50"
                        style={{ borderWidth: 2, borderColor: "#e5e7eb", borderStyle: "dotted" }}
                    >
                        <DocumentUpload size={ 24 } className="text-baseGreen" />
                        <Text className="mt-4 font-montserratMedium text-gray-700"><Text className="text-green-600">Click here</Text> to select image(s)</Text>
                        <Text className="mt-3 font-montserratMedium text-xs text-gray-400">Must not exceed 5 images (Max: 1MB/image)</Text>
                        <Text className="font-montserratMedium text-xs text-gray-400">Allowed format - JPG, PNG.</Text>
                    </TouchableOpacity>

                    {/*==== Selected images preview ====*/}
                    { selectedImages.length > 0 && (
                        <View>
                            <View className="h-auto w-full mt-5 flex-row items-center justify-between">
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
                        </View>
                    ) }
                </ScrollView>

                {/*==== Upload action ====*/}
                <View className="px-4 py-3 border-t border-gray-100">
                    <TouchableOpacity
                        onPress={ () => handleUploadColorAndImages() }
                        disabled={ isUploading || selectedImages.length === 0 }
                        className={`h-[50px] w-full flex-row items-center justify-center rounded-xl bg-baseGreen ${ (isUploading || selectedImages.length === 0) ? "opacity-50" : "" }`}
                    >
                        { isUploading
                            ? <ActivityIndicator color="#FFFFFF" />
                            : <Text className="font-montserratMedium text-base text-white">Upload image</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default UploadColorImageModal;
