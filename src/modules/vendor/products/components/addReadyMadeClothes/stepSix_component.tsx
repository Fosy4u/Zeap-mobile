import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {SelectList} from "react-native-dropdown-select-list";
import {ArrowDown2, Edit2} from "iconsax-react-native";

const StepSixComponent = () => {

    const [editProductInfo, setEditProductInfo] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Style A");
    const options = [
        { "key": "Option A", "value": "Option A" },
        { "key": "Option B", "value": "Option B" },
        { "key": "Option C", "value": "Option C" },
    ];

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Review and Submit</Text>
            <Text className="mt-2 font-montserratMedium">Kindly review all entries to ensure they are correct before proceeding to submit</Text>

            <View className="h-auto w-full mt-6 flex-row items-center justify-between">
                <Text className="font-montserratSemiBold text-base text-baseGreen">Product Information</Text>
                <TouchableOpacity
                    onPress={ () => setEditProductInfo(!editProductInfo) }
                    className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100"
                >
                    <Edit2 size={ 18 } variant="Bold" className="text-green-700" />
                </TouchableOpacity>
            </View>

            <Text aria-label="Product Title" nativeID="productTitle" className="mt-5 font-montserratMedium">Product title</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Product Title"
                    aria-labelledby="productTitle"
                    readOnly={!editProductInfo}
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Enter title"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    // onBlur={ onBlur }
                    // onChangeText={ onChange }
                    value={ "Long sleeve sweat shirt" }
                />
            </View>

            <Text aria-label="Product Subtitle" nativeID="productSubtitle" className="mt-5 font-montserratMedium">Product subtitle</Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Product Subtitle"
                    aria-labelledby="productSubtitle"
                    readOnly={!editProductInfo}
                    keyboardType="default"
                    textContentType="givenName"
                    placeholder="Enter subtitle"
                    placeholderTextColor="#9ca3af"
                    className="font-montserratMedium text-base"
                    // onBlur={ onBlur }
                    // onChangeText={ onChange }
                    value={ "Summer italian wool" }
                />
            </View>

            <Text aria-label="Product Description" nativeID="productDescription" className="mt-5 font-montserratMedium">Product description</Text>
            <View className="h-auto w-full mt-1.5 px-3 border rounded-xl border-gray-200 bg-gray-50">
                <TextInput
                    aria-label="Product Description"
                    aria-labelledby="productDescription"
                    readOnly={!editProductInfo}
                    keyboardType="default"
                    placeholder="Enter description here..."
                    placeholderTextColor="#9ca3af"
                    multiline={ true }
                    textAlignVertical="top"
                    className="h-[100px] font-montserratMedium text-base"
                    // onBlur={ onBlur }
                    // onChangeText={ onChange }
                    value={ "Lorem ipsum dolor sit amet consectetur. Massa aliquet facilisis maecenas phasellus sit." }
                />
            </View>

            <Text aria-label="Style" nativeID="style" className="mt-5 font-montserratMedium">Product style</Text>
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
                    placeholder="Select style"
                />
            </View>

            <Text aria-label="Tag" nativeID="tag" className="mt-5 font-montserratMedium">Tag</Text>
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
                    placeholder="Select tag"
                />
            </View>

            {/*=========================================================================================================*/}
            <View className="h-auto w-full mt-10 flex-row items-center justify-between">
                <Text className="font-montserratSemiBold text-base text-baseGreen">Category</Text>
                <TouchableOpacity
                    onPress={ () => null}
                    className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100"
                >
                    <Edit2 size={ 18 } variant="Bold" className="text-green-700" />
                </TouchableOpacity>
            </View>

            <Text aria-label="Category" nativeID="category" className="mt-5 font-montserratMedium">Main category</Text>
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

            <Text aria-label="Style" nativeID="style" className="mt-5 font-montserratMedium">Style</Text>
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

            <Text aria-label="Gender" nativeID="gender" className="mt-5 font-montserratMedium">Gender</Text>
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

            <Text aria-label="Age" nativeID="age" className="mt-5 font-montserratMedium">Age</Text>
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

            <Text aria-label="Brand" nativeID="brand" className="mt-5 font-montserratMedium">Brand</Text>
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

            <Text aria-label="Design" nativeID="design" className="mt-5 font-montserratMedium">Design</Text>
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

            <Text aria-label="Occasion" nativeID="occasion" className="mt-5 font-montserratMedium">Occasion</Text>
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
export default StepSixComponent;
