import React from 'react';
import {SafeAreaView, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import { Add } from 'iconsax-react-native';

interface Props {
    productID: string;
    productTitle?: string;
    setShowDeleteProductWarningModal:  React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteProduct: (productID: string) => void;
};

const DeleteProducWarningPopupModal: React.FC<Props> = ({ productID, productTitle, setShowDeleteProductWarningModal, handleDeleteProduct }) => {

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60"/>
            <View className="w-[330px] px-5 pt-10 pb-7 items-center rounded-xl bg-white">
                <TouchableOpacity
                    onPress={ () => setShowDeleteProductWarningModal(false) }
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="absolute top-3 right-3 rotate-45"
                >
                    <Add size={ 28 } color="#6b7280" />
                </TouchableOpacity>

                <View className="h-[64px] w-[64px] items-center justify-center rounded-full border-[3px] border-red-400">
                    <Text className="font-montserratBold text-[32px] leading-[38px] text-red-400">!</Text>
                </View>

                <Text className="mt-5 text-center font-montserratRegular text-base text-red-500">Are you sure you want to delete</Text>
                <Text className="mt-1 text-center font-montserratSemiBold text-base text-gray-900">{ productTitle || "this product" }</Text>
                <Text className="mt-5 text-center font-montserratRegular text-base leading-6 text-red-500">
                    This action will remove the product from your shop and cannot be undone.
                </Text>

                <View className="h-auto w-full mt-7 flex-row">
                    <TouchableOpacity
                        onPress={ () => handleDeleteProduct(productID) }
                        className="h-[48px] flex-1 flex-row items-center justify-center rounded-lg bg-red-700"
                    >
                        <Text className="font-montserratMedium text-base text-white">Yes, I'm sure</Text>
                    </TouchableOpacity>
                    <View className="w-[12px]"/>

                    <TouchableOpacity
                        onPress={ () => setShowDeleteProductWarningModal(false) }
                        className="h-[48px] flex-1 flex-row items-center justify-center rounded-lg border border-gray-200 bg-white"
                    >
                        <Text className="font-montserratMedium text-base text-gray-900">No, cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default DeleteProducWarningPopupModal;
