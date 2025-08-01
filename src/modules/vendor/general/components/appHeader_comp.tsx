import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'iconsax-react-native'
import {Text, TouchableOpacity, View} from 'react-native'
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import LinearGradient from 'react-native-linear-gradient';

interface IProps {
    title: string;
};

const AppHeaderComp: React.FC<IProps> = ({ title }) => {
  const { userData } = useSelector((state: RootState) => state.profileState );
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    
    return (userData.isVendor
        ? (
            <View className="h-[120px] w-full pt-4 px-5 rounded-b-3xl bg-baseGreen">
                <View className="h-auto w-full flex-row items-center justify-between ">
                    <TouchableOpacity
                        onPress={ () => navigation.goBack() }
                        className="h-[45px] w-[45px] flex items-center justify-center rounded-xl bg-[#20704329]"
                    >
                        <ArrowLeft color="#D5B07B" size={24} />
                    </TouchableOpacity>
                    
                    <Text className="font-montserratSemiBold text-xl text-white">{ title }</Text>

                    <View className="h-[40px] w-[40px]" />
                </View>
            </View>
        ) : (
            <View className="h-auto w-full pt-5 px-5">
                <View className="h-auto w-full flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={ () => navigation.goBack() }
                        className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen"
                    >
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>

                    <Text className="font-montserratSemiBold text-xl text-baseGreen">{ title }</Text>

                    <View className="h-[40px] w-[40px]" />
                </View>
                
                <LinearGradient
                    colors={[
                        "rgba(229, 231, 235, 0)",
                        "#e5e7eb",
                        "#9ca3af",
                        "#e5e7eb",
                        "rgba(229, 231, 235, 0)"
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-[1px] w-full mt-3 rounded"
                />
            </View>
        )
    );
};

export default AppHeaderComp;