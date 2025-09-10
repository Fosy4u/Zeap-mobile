import CheckBox from '@react-native-community/checkbox';
import React from 'react'
import { Text, View } from 'react-native';

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
                { accessorySizes.map((size: string, index: number) => (
                    <View key={ index } className="h-auto w-full mt-1.5 pb-2 flex-row items-center justify-start space-x-2">
                        <CheckBox
                            onValueChange={ (selectedValue) => setSelectedSizes(selectedValue ? [...selectedSizes, size] : selectedSizes.filter((value: string) => value !== size)) }
                            value={selectedSizes.includes(size)}
                        />
                        <Text className="font-montserratMedium text-base text-baseGreen">{ size }</Text>
                    </View>
                )) }
            </View>
        </View>
    );
};

export default StepThreeComponent