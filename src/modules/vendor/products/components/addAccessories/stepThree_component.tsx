import CheckBox from '@react-native-community/checkbox';
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';

interface IProps {
    accessorySizes: string[];
    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
};

const StepThreeComponent: React.FC<IProps> = ({ accessorySizes, selectedSizes, setSelectedSizes }) => {
    
    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 3: Size</Text>
            <Text className="mt-2 font-montserratMedium">Select the sizes of the product available.</Text>
            
            <View className="h-auto w-full mt-1.5 px-3 py-3.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                {/* Same row treatment as the step 2 dropdowns: the whole row is the
                    tap target at the 44pt platform minimum. */}
                { accessorySizes.map((size: string, index: number) => {
                    const isChecked = selectedSizes.includes(size);

                    return (
                        <TouchableOpacity
                            key={ index }
                            onPress={ () => setSelectedSizes(isChecked ? selectedSizes.filter((value: string) => value !== size) : [...selectedSizes, size]) }
                            activeOpacity={ 0.6 }
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: isChecked }}
                            accessibilityLabel={ size }
                            className="h-auto w-full my-0.5 px-1 flex-row items-center justify-start space-x-2 rounded-lg"
                            style={{ minHeight: 44 }}
                        >
                            {/* Presentational only — the row owns the toggle. */}
                            <View pointerEvents="none">
                                <CheckBox
                                    value={ isChecked }
                                    boxType="square"
                                    lineWidth={1.5}
                                    tintColor="#151518"
                                    onCheckColor="#ffffff"
                                    onFillColor="#133522"
                                    onTintColor="#133522"
                                    animationDuration={0.15}
                                    style={{ height: 20, width: 20 }}
                                />
                            </View>
                            <Text className="flex-1 font-montserratMedium text-base text-baseGreen">{ size }</Text>
                        </TouchableOpacity>
                    );
                }) }
            </View>
        </View>
    );
};

export default StepThreeComponent