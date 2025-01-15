import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { RootState } from '../../../../redux/store/store.ts';

interface IProps {
    handleShowSizeGuideBottomSheet: (value: boolean) => void;
}

const SizeGuideBottomSheet: React.FC<IProps> = ({ handleShowSizeGuideBottomSheet }) => {
    const { savedMeasurements } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.35;
    const slideAnimation = useRef<Animatable.View>(null);
    

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseSizeGuideBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                handleShowSizeGuideBottomSheet(false);
            });
        } else {
            handleShowSizeGuideBottomSheet(false);
        }
    };

    const tableData = [
        ['S', '32', '14', '34', '40'],
        ['M', '34', '15', '36', '42'],
        ['L', '36', '16', '38', '44'],
        ['XL', '38', '17', '40', '46'],
        ['XXL', '40', '18', '42', '48'],
        ['XXXL', '42', '19', '44', '50'],
      ];
      const headers = ['Size', 'NG', 'Shoulder', 'Bust', 'Length'];

    
    return (
        <SafeAreaView className="h-full w-full absolute bg-black/40">

           <Animatable.View 
                ref={slideAnimation}
                className="w-full px-5 pt-7 pb-5 absolute bottom-0 bg-white"
                style={{ 
                    height: modalHeight,
                    transform: [{ translateY: modalHeight }]
                }}
            >
                <View className="h-auto w-full flex-row items-center justify-between">
                    <Text className="font-montserratSemiBold text-2xl text-gray-700">Size Guide</Text>

                    <TouchableOpacity 
                        onPress={ () => handleCloseSizeGuideBottomSheet() }
                    >
                        <Image
                            className="h-[30px] w-[30px]"
                        source={ require("../../../../../assets/images/close.png") }
                        />
                    </TouchableOpacity>
                </View>
                
                <View className="mt-7 flex-1 flex-col">
                    <Text className="mt-2 font-montserratSemiBold text-base text-gray-700">Product details</Text>
                    
                    <View className="h-[44px] w-[250px] mx-auto mt-5 flex-row border border-gray-400 rounded-3xl  bg-gray-100">
                        <TouchableOpacity className="h-[43px] flex-1 items-center justify-center rounded-tl-3xl rounded-bl-3xl bg-baseGreen">
                            <Text className="font-montserratMedium text-white">Top</Text>
                        </TouchableOpacity>
                      
                        <TouchableOpacity className="h-[44px] flex-1 items-center justify-center rounded-tl-3xl rounded-bl-3xl">
                            <Text className="font-montserratMedium">Bottom</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-4 border border-gray-300">
                        <View className="flex-row">
                            {headers.map((header, index) => (
                                <Text key={index} className="flex-1 px-1 py-2 font-montserratSemiBold text-center text-xs bg-gray-200 border border-gray-200">{header}</Text>
                            ))}
                        </View>
                        {tableData.map((row, rowIndex) => (
                            <View key={rowIndex} className="flex-row">
                                { row.map((cell, cellIndex) => (
                                    <Text key={cellIndex} className="flex-1 p-1.5 font-montserratMedium text-center border border-gray-200">{cell}</Text>
                                )) }
                            </View>
                        ))}
                    </View>

                    <Text className="mt-5 font-montserratMedium">The data is measured manually and may have minor discrepancies.</Text>
                </View>
            </Animatable.View>
        </SafeAreaView>
    )
};

export default SizeGuideBottomSheet;