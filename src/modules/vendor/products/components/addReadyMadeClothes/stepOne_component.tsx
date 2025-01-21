import React, {useState} from 'react';
import {Text, TextInput, View} from "react-native";
import {SelectList} from "react-native-dropdown-select-list";
import {ArrowDown2} from "iconsax-react-native";

const StepOneComponent = () => {

    const [selectedStyle, setSelectedStyle] = useState("Style A");
    const styleOptions = [
        { "key": "Style A", "value": "Style A" },
        { "key": "Style B", "value": "Style B" },
        { "key": "Style C", "value": "Style C" },
    ];

    const [selectedTag, setSelectedTag] = useState("Style A");
    const tagOptions = [
        { "key": "Tag A", "value": "Tag A" },
        { "key": "Tag B", "value": "Tag B" },
        { "key": "Tag C", "value": "Tag C" },
    ];

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 1: Product Information</Text>
            <Text className="mt-2 font-montserratMedium">Enter all correct information for this product and proceed</Text>

            <Text aria-label="Product Title" nativeID="productTitle" className="mt-6 font-montserratMedium">Product title</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Product Title"
                    aria-labelledby="productTitle"
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Enter title"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    onChangeText={(value) => null}
                />
            </View>

            <Text aria-label="Product Subtitle" nativeID="productSubtitle" className="mt-5 font-montserratMedium">Product subtitle<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Product Subtitle"
                    aria-labelledby="productSubtitle"
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Enter subtitle"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    onChangeText={(value) => null}
                />
            </View>

            <Text aria-label="Description" nativeID="description" className="mt-5 font-montserratMedium">Product description<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Description"
                    aria-labelledby="description"
                    keyboardType="default"
                    placeholder="Enter description here..."
                    placeholderTextColor="#9ca3af"
                    multiline={ true }
                    textAlignVertical="top"
                    className="h-[100px] font-montserratMedium text-base"
                    // onBlur={ onBlur }
                    // onChangeText={ onChange }
                    // value={ value }
                />
            </View>

            <Text aria-label="Style" nativeID="style" className="mt-5 font-montserratMedium">Product style<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedStyle }
                    data={ styleOptions }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select style"
                />
            </View>

            <Text aria-label="Tag" nativeID="tag" className="mt-5 font-montserratMedium">Tag<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedTag }
                    data={ tagOptions }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select tag"
                />
            </View>
        </View>
    )
}
export default StepOneComponent;
