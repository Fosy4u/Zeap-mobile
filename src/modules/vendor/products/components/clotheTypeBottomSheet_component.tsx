import React, {useEffect, useRef} from 'react';
import {Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable";
import {Add, ArrowRight} from "iconsax-react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";
import { RootState } from '../../../../redux/store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setClotheType, setProductMode, setSelectedStep } from '../slices/vendorProductState_slice.ts';

interface IProps {
    handleShowClotheTypeBottomSheet: (value: boolean) => void;
}

const ClotheTypeBottomSheetComponent: React.FC<IProps> = ({ handleShowClotheTypeBottomSheet }) => {
    const { clotheType } = useSelector((state: RootState) => state.vendorProductState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const screenHeight = Dimensions.get("window").height;
    const modalHeight = screenHeight / 1.6;
    const slideAnimation = useRef<Animatable.View>(null);

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 1000);
        }
    }, [modalHeight]);

    const handleCloseClotheTypeBottomSheet = () => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: 0, opacity: 1 },
                1: { translateY: modalHeight, opacity: 0 }
            }, 500).then(() => {
                handleShowClotheTypeBottomSheet(false);
            });
        } else {
            handleShowClotheTypeBottomSheet(false);
        }
    };

    return (
        <SafeAreaView className="h-full w-full absolute bg-black/40">

            <Animatable.View
                ref={slideAnimation}
                className="w-full absolute bottom-0 rounded-t-xl bg-white"
                style={{
                    height: modalHeight,
                    transform: [{ translateY: modalHeight }]
                }}
            >

                {/*==== Header ====*/}
                <View className="h-[110px] w-full pt-4 px-5 rounded-t-xl rounded-b-3xl bg-baseGreen">
                    <View className="h-auto w-full flex-row items-center justify-between ">
                        <View className="px-6" />

                        <Text className="font-montserratMedium text-xl text-white">Clothe Type</Text>

                        <TouchableOpacity
                            onPress={ () => handleCloseClotheTypeBottomSheet() }
                            className="bg-[#20704329] p-1 rounded-xl"
                        >
                            <Add color="#D5B07B" size={36} className="rotate-45" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="h-[calc(78%)] w-full px-5 py-7 flex-col justify-between">
                    <View className="">
                        <Text className="font-montserratMedium text-base text-gray-700">Select clothe type to add</Text>

                        <View className="h-auto w-full mt-5 flex-row">
                            <TouchableOpacity
                                onPress={ () => setClotheType("Bespoke") }
                                className={`h-auto w-full px-5 py-5 flex-1 rounded-xl border ${ clotheType === "Bespoke" ? "border-baseGreen" : "border-gray-100" } bg-gray-50`}
                            >
                                <View className="w-[50px] h-[50px] flex-row items-center justify-center rounded-xl bg-gray-100">
                                    <Image
                                        source={
                                            require("../../../../../assets/images/sew.png")
                                        }
                                        resizeMode="contain"
                                        className="h-[25px] w-auto rounded-2xl"
                                    />
                                </View>
                                <Text className="mt-2 font-montserratMedium text-sm text-gray-700">Bespoke</Text>
                            </TouchableOpacity>
                            <View className="w-[20px]" />

                            <TouchableOpacity
                                onPress={ () => setClotheType("Readymade") }
                                className={`h-auto w-full px-5 py-5 flex-1 rounded-xl border ${ clotheType === "Readymade" ? "border-baseGreen" : "border-gray-100" } bg-gray-50`}
                            >
                                <View className="w-[50px] h-[50px] flex-row items-center justify-center rounded-xl bg-gray-100">
                                    <Image
                                        source={
                                            require("../../../../../assets/images/clothe.png")
                                        }
                                        resizeMode="contain"
                                        className="h-[25px] w-auto rounded-2xl"
                                    />
                                </View>
                                <Text className="mt-2 font-montserratMedium text-sm text-gray-700">Readymade</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={ () => {
                            handleShowClotheTypeBottomSheet(false);
                            dispatch(setProductMode("New"));
                            dispatch(setSelectedStep(1));
                            clotheType === "Bespoke" ? navigation.navigate("addBespokeClothesScreen") : navigation.navigate("addReadyMadeClothesScreen");
                        } }
                        className="h-[55px] w-auto mt-7 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                    >
                        <Text className="font-montserratMedium text-lg text-white mr-2">Proceed</Text>
                        <ArrowRight className="text-white" />
                    </TouchableOpacity>
                </View>
            </Animatable.View>

        </SafeAreaView>
    )
}
export default ClotheTypeBottomSheetComponent
