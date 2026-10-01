import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import SearchableDropdownComponent from '../searchableDropdown_component';

interface IProps {
    sizeStandardOptions: string[];
    selectedSizeStandard: string;
    handleSelectSizeStandard: (standard: string) => void;
    clotheSizes: string[];
    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
    showSizesDropDown: boolean;
    setShowSizesDropDown: React.Dispatch<React.SetStateAction<boolean>>;
};

const StepThreeComponent: React.FC<IProps> = ({
    sizeStandardOptions,
    selectedSizeStandard,
    handleSelectSizeStandard,
    clotheSizes,
    selectedSizes,
    setSelectedSizes,
    showSizesDropDown,
    setShowSizesDropDown,
}) => {

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 3: Size</Text>
            <Text className="mt-2 font-montserratMedium">Select the size standard, then the sizes available for this product.</Text>

            {/* ==== Size standard ==== */}
            <View className="h-auto w-full mt-4 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50">
                <Text className="font-montserratSemiBold text-base text-baseGreen">Size standard<Text className="text-red-600">*</Text></Text>
                <Text className="mt-1 font-montserratMedium text-sm text-gray-500">Which size standard is used for this product?</Text>

                <View className="mt-3">
                    { sizeStandardOptions.map((standard: string) => {
                        const isSelected = selectedSizeStandard === standard;
                        return (
                            <TouchableOpacity
                                key={ standard }
                                onPress={ () => handleSelectSizeStandard(standard) }
                                className="h-auto w-full py-2.5 flex-row items-center"
                            >
                                {/* Radio indicator */}
                                <View className={`h-[20px] w-[20px] rounded-full border-2 items-center justify-center ${ isSelected ? "border-baseGreen" : "border-gray-300" }`}>
                                    { isSelected && <View className="h-[10px] w-[10px] rounded-full bg-baseGreen" /> }
                                </View>
                                <Text className="ml-3 font-montserratMedium text-base text-baseGreen">{ standard }</Text>
                            </TouchableOpacity>
                        );
                    }) }
                </View>
            </View>

            {/* ==== Sizes (for the chosen standard) — searchable multi-select.
                Selected sizes appear as badges below the field. ==== */}
            { selectedSizeStandard ? (
                <SearchableDropdownComponent
                    label="Available sizes"
                    required
                    placeholder={ `Select the ${selectedSizeStandard} sizes available` }
                    options={ clotheSizes }
                    isOpen={ showSizesDropDown }
                    onToggleOpen={ () => setShowSizesDropDown(!showSizesDropDown) }
                    mode="multi"
                    selectedValues={ selectedSizes }
                    onChangeValues={ setSelectedSizes }
                />
            ) : (
                <View className="mt-4 px-3 py-5 border border-gray-200 rounded-xl bg-gray-50 items-center">
                    <Text className="font-montserratMedium text-sm text-gray-500 text-center">Select a size standard above to choose the available sizes.</Text>
                </View>
            ) }
        </View>
    );
};

export default StepThreeComponent;
