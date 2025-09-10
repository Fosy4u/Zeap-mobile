import React from 'react'
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

interface IProps {
    screenTitle?: string;
};

const EmptyListComponent: React.FC<IProps> = (props) => {
    const { screenTitle } = props;

    return (
        <View className="h-auto w-full mt-1 p-10 bg-gray-50">
            <FastImage
                source={ require("../../../../../assets/images/empty_box.png") }
                defaultSource={ require("../../../../../assets/images/empty_box.png") }
                resizeMode={ FastImage.resizeMode.contain }
                className="h-[70px] w-full"
            />

            <Text className="mt-4 text-center text-gray-400">You don't have any { screenTitle } products.</Text>
        </View>
    );
}

export default EmptyListComponent;