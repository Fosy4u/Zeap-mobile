import React, {useState} from 'react';
import {Text, View} from "react-native";
import { MultipleSelectList, SelectList} from "react-native-dropdown-select-list";
import {ArrowDown2} from "iconsax-react-native";
import { Control, Controller, set } from 'react-hook-form';
import useStepTwoHook from '../../hooks/bespokeClothes/stepTwo_hook';

interface IProps {
    control: Control<any>;
    errors: any;
}

const StepTwoComponent: React.FC<IProps> = ({ control, errors }) => {

    const { mainOptions, styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, brandOptions,
        designOptions, occasionOptions, sleeveLengthOptions, fasteningOptions, fitOptions,

        selectedMain, setSelectedMain,
        selectedStyle, setSelectedStyle,
        selectedGender, setSelectedGender,
        selectedDesign, setSelectedDesign,
        selectedOccasion, setSelectedOccasion,
        selectedFastening, setSelectedFastening,
        selectedFit, setSelectedFit,
        selectedAge, setSelectedAge,
    } = useStepTwoHook();
        

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 2: Category</Text>
            <Text className="mt-2 font-montserratMedium">Enter all correct information for this product’s category and proceed</Text>

            {/* ==== Main category ==== */}
            <Text aria-label="Main" nativeID="main" className="mt-5 font-montserratMedium">Main category<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="main"
                    defaultValue={[]} // Ensure it's always an array
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedMain(selectedValues)}
                            data={mainOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Categories"
                            placeholder="Select at least one category"
                            save="key"
                            onSelect={ () => onChange(selectedMain) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>

            {/* ==== Style ==== */}
            <Text aria-label="Style" nativeID="style" className="mt-5 font-montserratMedium">Style<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="style"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedStyle(selectedValues)}
                            data={styleOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Styles"
                            placeholder="Select at least one style"
                            save="key"
                            onSelect={ () => onChange(selectedStyle) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>

            {/* ==== Gender ==== */}
            <Text aria-label="Gender" nativeID="gender" className="mt-5 font-montserratMedium">Gender<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="gender"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedGender(selectedValues)}
                            data={genderOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Gender"
                            placeholder="Select at least one gender"
                            save="key"
                            onSelect={ () => onChange(selectedGender) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>

            {/* ==== Age Group ==== */}
            <Text aria-label="AgeGroup" nativeID="ageGroup" className="mt-5 font-montserratMedium">Age group<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-2 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="ageGroup"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <SelectList
                            setSelected={(selectedValues: string) => {
                                onChange(selectedValues || "");
                                setSelectedAge(selectedValues);
                            }}
                            data={ageGroupOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            placeholder="Select at least one age"
                            save="key"
                            defaultOption={value || ""} // Ensures an array is always passed
                        />
                    )}
                />
            </View>

            {/* Check if the selected age is kids, then display the ageRange Dropdown */}
            { selectedAge === "Kids" && (
                <View>
                    <Text aria-label="AgeRange" nativeID="ageRange" className="mt-5 font-montserratMedium">Age range<Text className="text-red-600">*</Text></Text>
                    <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-2 border rounded-xl border-gray-200 bg-gray-50 z-50">
                        <Controller
                            control={control}
                            name="ageRange"
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <SelectList
                                    setSelected={(selectedValue: string) => onChange(selectedValue)}
                                    data={ageRangeOptions}
                                    boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                                    inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                                    dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                                    arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                                    search={ true }
                                    placeholder="Select at least one age range"
                                    save="key"
                                    defaultOption={value || ""} // Ensures an array is always passed
                                />
                            )}
                        />
                    </View>
                </View>
            )}

            {/* ==== Brand ==== */}
            <Text aria-label="Brand" nativeID="brand" className="mt-5 font-montserratMedium">Brand<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-2 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="brand"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <SelectList
                            setSelected={(selectedValue: string) => onChange(selectedValue)}
                            data={brandOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            placeholder="Select at least one brand"
                            save="key"
                            defaultOption={value || ""} // Ensures an array is always passed
                        />
                    )}
                />
            </View>

            {/* ==== Design ==== */}
            <Text aria-label="Design" nativeID="design" className="mt-5 font-montserratMedium">Design<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="design"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedDesign(selectedValues)}
                            data={designOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Design"
                            placeholder="Select at least one design"
                            save="key"
                            onSelect={ () => onChange(selectedDesign) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>

            {/* ==== Occasion ==== */}
            <Text aria-label="Occasion" nativeID="occasion" className="mt-5 font-montserratMedium">Occasion<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="occasion"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedOccasion(selectedValues)}
                            data={occasionOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Occasion"
                            placeholder="Select at least one occasion"
                            save="key"
                            onSelect={ () => onChange(selectedOccasion) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>

            {/* ==== Sleeve Length ==== */}
            <Text aria-label="SleeveLength" nativeID="occasion" className="mt-5 font-montserratMedium">Sleeve length<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="sleeveLength"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <SelectList
                            setSelected={(selectedValue: string) => onChange(selectedValue)}
                            data={sleeveLengthOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}    
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            placeholder="Select at least one sleeve length"
                            save="key"
                            defaultOption={value || ""} // Ensures an array is always passed
                        />
                    )}
                />
            </View>

            {/* ==== Fastening ==== */}
            <Text aria-label="Fastening" nativeID="fastning" className="mt-5 font-montserratMedium">Fastening<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="fastening"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedFastening(selectedValues)}
                            data={fasteningOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}    
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Fastening"
                            placeholder="Select at least one fastening"
                            save="key"
                            onSelect={ () => onChange(selectedFastening) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>

            {/* ==== Fit ==== */}
            <Text aria-label="Fit" nativeID="fit" className="mt-5 font-montserratMedium">Fit<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 pt-2 pb-0 border rounded-xl border-gray-200 bg-gray-50 z-50">
                <Controller
                    control={control}
                    name="fit"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <MultipleSelectList
                            setSelected={(selectedValues: string[]) => setSelectedFit(selectedValues)}
                            data={fitOptions}
                            boxStyles={{ height: 38, width: "auto", paddingTop: 6, paddingBottom: 4, paddingHorizontal: 10, borderColor: "transparent", backgroundColor: "transparent" }}
                            inputStyles={{ marginBottom: 3, fontSize: 16, color: "#9ca3af", fontFamily: "Montserrat-Medium", backgroundColor: "transparent" }}    
                            dropdownStyles={{ height: "auto", width: "auto", marginBottom: 10, paddingTop: 0, borderColor: "lightgray" }}
                            arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                            search={ true }
                            label="Fit"
                            placeholder="Select at least one fit"
                            save="key"
                            onSelect={ () => onChange(selectedFit) }
                            defaultOption={value || []}
                        />
                    )}
                />
            </View>
        </View>
    )
}
export default StepTwoComponent;
