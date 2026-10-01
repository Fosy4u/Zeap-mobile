import React from 'react';
import { ImageBackground, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    productTitle: string;
    onCancel: () => void;
    onConfirm: () => void;
}

// Confirmation shown before deleting a draft product from the "Products in
// draft" list. Names the product and makes the permanence explicit.
const DeleteDraftWarningPopupModal: React.FC<Props> = ({ productTitle, onCancel, onConfirm }) => {

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <View className="h-full w-full absolute inset-0 bg-black opacity-60" />
            <View className="w-[320px] rounded-2xl bg-white">
                <ImageBackground
                    source={ require("../../../../../assets/images/warning_modal_image.png") }
                    resizeMode="contain"
                    className="h-[120px] w-full p-3 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-baseGreen"
                    imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                />

                <View className="px-5 py-5 items-center justify-center">
                    <Text className="font-montserratMedium text-center text-base text-gray-700">Are you sure you want to delete</Text>
                    <Text className="mt-1 font-montserratSemiBold text-center text-lg text-baseGreen">{ productTitle }</Text>
                    <Text className="mt-2 font-montserratMedium text-center text-sm text-gray-500">This action will permanently delete the draft product</Text>

                    <View className="h-auto w-full mt-6 flex-row">
                        <TouchableOpacity
                            onPress={ onConfirm }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-red-50"
                        >
                            <Text className="font-montserratMedium text-red-700">Yes, I'm sure</Text>
                        </TouchableOpacity>
                        <View className="w-[10px]" />
                        <TouchableOpacity
                            onPress={ onCancel }
                            className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                        >
                            <Text className="font-montserratMedium text-white">No, cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default DeleteDraftWarningPopupModal;
