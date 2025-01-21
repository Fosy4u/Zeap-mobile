import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {SelectList} from "react-native-dropdown-select-list";
import {Add, ArrowDown2, ArrowRight, Edit2, Trash} from "iconsax-react-native";
import CheckBox from "@react-native-community/checkbox";

const StepFiveComponent = () => {

    const [rememberMe, setRememberMe] = useState(false);
    const colours = [
        { colorName: "Gray", colorCode: "#AEAEAE" },
        { colorName: "Peach", colorCode: "#FF85A7" },
        { colorName: "Brown", colorCode: "#F2AD81" },
        { colorName: "Black", colorCode: "#000000" },
    ];
    const sizes = ["Small", "Medium", "Large", "X-Large", "XX-Large"];

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 5: Variations</Text>
            <Text className="mt-2 font-montserratMedium">Set variations for your product item.</Text>

            <View className="h-auto w-full mt-5 px-5 py-4 rounded-xl border border-blue-800 bg-blue-50">
                <Text className="font-montserratSemiBold text-xs text-gray-700">Note:</Text>
                <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-5">You can add multiple variations to your product.
                    For example, if you are selling a T-Shirt, you can add different sizes and colors as variations.
                    Start by selecting one of the selected colors and then add the size, price and quantity
                </Text>
            </View>

            <Text className="mt-6 font-montserratSemiBold text-xs text-gray-700">Colour</Text>
            <Text className="font-montserratMedium text-xs text-gray-700">Select a colour</Text>
            <View className="h-auto w-full mt-3 flex-row items-center flex-wrap gap-x-1">
                { colours.map((eachColor, index) => (
                    <View key={index} className="h-auto w-16 py-2.5 rounded-lg" style={{ backgroundColor: eachColor.colorCode }}>
                        <Text className="text-xs text-center text-white">{ eachColor.colorName }</Text>
                    </View>
                )) }
            </View>

            <Text className="mt-6 font-montserratSemiBold text-xs text-gray-700">Size</Text>
            <Text className="font-montserratMedium text-xs text-gray-700">Select a size</Text>
            <View className="h-auto w-full mt-3 flex-row items-center flex-wrap gap-x-1">
                { sizes.map((eachSize, index) => (
                    <View key={index} className="h-auto w-[66px] py-2.5 rounded-lg border border-gray-200">
                        <Text className="font-montserratMedium text-xs text-center text-gray-700">{ eachSize }</Text>
                    </View>
                )) }
            </View>

            <Text aria-label="Quantity" nativeID="quantity" className="mt-5 font-montserratMedium">Quantity<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Quantity"
                    aria-labelledby="quantity"
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Enter quantity"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    onChangeText={(value) => null}
                />
            </View>

            <Text aria-label="Price" nativeID="price" className="mt-5 font-montserratMedium">Price<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Price"
                    aria-labelledby="price"
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Enter amount"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    onChangeText={(value) => null}
                />
            </View>

            <View className="mt-3 flex-row items-center">
                <CheckBox
                    value={ rememberMe }
                    onValueChange={ (newValue) => setRememberMe(newValue) }
                    tintColors={{ true: "#133522", false: "#151518" }}
                />
                <Text className="font-montserratMedium">Set this as your default variation option</Text>
            </View>

            <View className="flex-row justify-end">
                <TouchableOpacity className="h-[55px] flex-row items-center justify-center ">
                    <Add size={ 26 } className="text-baseGreen" />
                    <Text className="mr-2 font-montserratMedium text-base text-baseGreen">Add Variation</Text>
                </TouchableOpacity>
            </View>

            <Text className="mt-3 font-montserratSemiBold text-xs text-gray-700">Added Variations</Text>
            <View className="h-auto w-full mt-4 px-5 py-4 rounded-xl border border-gray-200 bg-gray-50">
                <Text className="font-montserratMedium text-justify text-xs text-gray-700 leading-7">
                    SKU: 5765262/RMC/35611-10-Peach{"\n"}
                    Color: Peach{"\n"}
                    Size: Medium{"\n"}
                    Price: 25,000{"\n"}
                    Quantity: 57{"\n"}
                </Text>

                <View className="h-auto w-full mt-1 flex-row">
                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-10 w-24 flex-row items-center justify-center rounded-lg border border-red-200 bg-red-50"
                    >
                        <Trash size={ 18 } variant="Bold" className="mr-2 text-red-700" />
                        <Text className="font-montserratMedium text-xs text-red-700">Delete</Text>
                    </TouchableOpacity>
                    <View className="w-4" />

                    <TouchableOpacity
                        onPress={ () => null }
                        className="h-10 w-24 flex-row items-center justify-center rounded-lg border border-blue-200 bg-blue-50"
                    >
                        <Edit2 size={ 18 } variant="Bold" className="mr-2 text-blue-700" />
                        <Text className="font-montserratMedium text-xs text-blue-700">Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default StepFiveComponent;
