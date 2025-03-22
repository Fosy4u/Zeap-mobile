import React, {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Add, ArrowLeft, DocumentUpload} from "iconsax-react-native";
import CheckBox from "@react-native-community/checkbox";

const StepFourComponent = () => {
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 4: Color Selection & Image Match</Text>
            <Text className="mt-2 font-montserratMedium">Provide colour and select corresponding image</Text>

            <Text aria-label="ColourName" nativeID="colourName" className="mt-6 font-montserratMedium">Colour name<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="ColourName"
                    aria-labelledby="colourName"
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Select color"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    onChangeText={(value) => null}
                />
            </View>

            <Text aria-label="ColourName" nativeID="colourName" className="mt-6 font-montserratMedium">Upload image for color black</Text>
            <TouchableOpacity
                onPress={ () => null }
                className="h-auto w-full mt-1.5 px-3 py-5 flex-col items-center rounded-xl bg-gray-50"
                style={{ borderWidth: 2, borderColor: "#e5e7eb", borderStyle: "dotted" }}
            >
                <DocumentUpload size={ 24 } className="text-baseGreen" />
                <Text className="mt-4 font-montserratMedium text-gray-700"><Text className="text-green-600">Click here</Text> to upload file</Text>

                <Text className="mt-3 font-montserratMedium text-xs text-gray-400">Allowed format - JPG, PNG, PDF, DOCX</Text>
            </TouchableOpacity>

            {/*==== Added Colours ====*/}
            <Text className="mt-6 font-montserratSemiBold text-baseGreen">Added Colours</Text>
            <View>
                <Text className="mt-2 font-montserratMedium">Pitch colour</Text>
                <View className="h-16 w-20 p-0 relative flex items-center justify-center rounded-lg border border-gray-400 bg-gray-200">
                    <Image
                        source={ require("../../../../../../assets/images/home/sweat_shirt.png") }
                        resizeMode="contain"
                        className="h-[63px] w-[79px] absolute inset-0"
                    />
                    <Add size={22} className="absolute top-1 right-0 text-baseGreen rotate-45 z-10" />
                </View>
            </View>

            <View className="mt-4 flex-row items-center">
                <CheckBox
                    value={ rememberMe }
                    onValueChange={ (newValue) => setRememberMe(newValue) }
                    tintColors={{ true: "#133522", false: "#151518" }}
                />
                <Text className="font-montserratMedium">Set this as your default image option</Text>
            </View>

            <View className="flex-row justify-end">
                <TouchableOpacity className="h-[55px] flex-row items-center justify-center ">
                    <Add size={ 26 } className="text-baseGreen" />
                    <Text className="mr-2 font-montserratMedium text-base text-baseGreen">Add Colour</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
export default StepFourComponent;
