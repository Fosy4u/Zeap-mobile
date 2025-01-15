import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'iconsax-react-native'
import {Text, TouchableOpacity, View} from 'react-native'
import RootNavigationStackModel from '../../../../routes/model/routes_model';

interface IProps {
    title: string;
};

const AppHeaderComp: React.FC<IProps> = ({ title }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    
    return (
        <View className="h-[120px] w-full pt-4 px-5 rounded-b-3xl bg-baseGreen">
            <View className="h-auto w-full flex-row items-center justify-between ">
                <TouchableOpacity
                    className="bg-[#20704329] p-2.5 rounded-xl"
                    onPress={ () => navigation.goBack() }
                >
                    <ArrowLeft color="#D5B07B" size={24} />
                </TouchableOpacity>
                
                <Text className="font-montserratMedium text-xl text-center text-white">{ title }</Text>

                <View className="px-6" />
            </View>
        </View>
    );
};

export default AppHeaderComp;