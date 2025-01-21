import React, {useState} from 'react';
import {Text, View} from "react-native";
import {SelectList} from "react-native-dropdown-select-list";
import {ArrowDown2} from "iconsax-react-native";

const StepThreeComponent = () => {

    const [selectedOption, setSelectedOption] = useState("Style A");
    const options = [
        { "key": "Option A", "value": "Option A" },
        { "key": "Option B", "value": "Option B" },
        { "key": "Option C", "value": "Option C" },
    ];

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 3: Size Upload</Text>
            <Text className="mt-2 font-montserratMedium">Upload all images and input all sizes for this product item</Text>

            <Text aria-label="Sizes" nativeID="sizes" className="mt-5 font-montserratMedium">Sizes<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select all sizes"
                />
            </View>
        </View>
    );
};
export default StepThreeComponent;
