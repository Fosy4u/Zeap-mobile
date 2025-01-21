import React, {useState} from 'react';
import {Text, TextInput, View} from "react-native";
import {SelectList} from "react-native-dropdown-select-list";
import {ArrowDown2} from "iconsax-react-native";

const StepTwoComponent = () => {

    const [selectedOption, setSelectedOption] = useState("Style A");
    const options = [
        { "key": "Option A", "value": "Option A" },
        { "key": "Option B", "value": "Option B" },
        { "key": "Option C", "value": "Option C" },
    ];

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 2: Category</Text>
            <Text className="mt-2 font-montserratMedium">Enter all correct information for this product’s category and proceed</Text>

            <Text aria-label="Category" nativeID="category" className="mt-5 font-montserratMedium">Main category<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>

            <Text aria-label="Style" nativeID="style" className="mt-5 font-montserratMedium">Style<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>

            <Text aria-label="Gender" nativeID="gender" className="mt-5 font-montserratMedium">Gender<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>

            <Text aria-label="Age" nativeID="age" className="mt-5 font-montserratMedium">Age<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>

            <Text aria-label="Brand" nativeID="brand" className="mt-5 font-montserratMedium">Brand<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>

            <Text aria-label="Design" nativeID="design" className="mt-5 font-montserratMedium">Design<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>

            <Text aria-label="Occasion" nativeID="occasion" className="mt-5 font-montserratMedium">Occasion<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <SelectList
                    setSelected={ setSelectedOption }
                    data={ options }
                    // maxHeight={100}
                    boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                    inputStyles={{ fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium" }}
                    dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                    dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                    search={ false }
                    placeholder="Select at least one"
                />
            </View>
        </View>
    )
}
export default StepTwoComponent;
