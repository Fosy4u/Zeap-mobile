import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'iconsax-react-native';
import { FlatList, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import useEditAccountDetailsHook from '../../profile/hooks/editAccountDetails_hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import useSettingsHook from '../hooks/settings_hook';
import AppLoader from '../../general/components/appLoader';

const CurrencySettingsScreen = () => {
  const { currencies, recommendedCurrency, isLoading: settingsIsLoading, loadingMessage: settingsLoadingMessage } = useSelector((state: RootState) => state.settingsState);
  const { userData, isLoading: profileIsLoading, loadingMessage: profileLoadingMessage } = useSelector((state: RootState) => state.profileState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
  // console.log("USER DATA", userData);

  const { handleSetRecommendedCurrency } = useSettingsHook();
  const { handleUpdatePreferredCurrency } = useEditAccountDetailsHook();

  // Request permission to access location
  useEffect(() => {
    handleSetRecommendedCurrency();
  }, [userData]);
    
  return (
    <SafeAreaView className="h-full w-full flex-1">
      <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
      />
      
      {/*==== Header ====*/}
      <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
          <TouchableOpacity onPress={ () => navigation.pop() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                  <ArrowLeft color="white" />
              </View>
          </TouchableOpacity>
          <Text className="font-montserratSemiBold text-lg text-baseGreen">Currency Setting</Text>
          <View className="h-[40px] w-[40px]" />
      </View>

      <View className="h-auto w-full mt-5 px-4">
        {/* ==== Grid View ==== */}
        <Text className="mb-1 font-montserratSemiBold text-base text-gray-700">Selected Currency</Text>
        <FlatList
          data={ currencies }
          keyExtractor={ (item) => item.code }
          numColumns={ 2 }
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          className="mx-0 p-0"
          renderItem={ ({ item: currency }) => (
            <CardItems
              handleOnPress={ () => handleUpdatePreferredCurrency(currency.code) }
              code={ currency.code }
              name={ currency.name }
              symbol={ currency.symbol }
              flag={ currency.flag }
              selected={ currency.code === userData?.prefferedCurrency!}
            />
          )}
        />

        <Text className="mt-5 font-montserratSemiBold text-base text-gray-700">Recommended Currency</Text>
        <View className="h-[100px] w-full mt-1 px-5 py-4 rounded-lg bg-[#F8F9FE]">
          <Text className="text-sm text-gray-500">Recommended currency based on your location:</Text>
          <View className="h-auto w-full flex-row items-center gap-x-5">
            <Text className="font-montserratSemiBold text-base text-gray-700">
              {recommendedCurrency.code} ({recommendedCurrency.symbol})
            </Text>
            <Text className="text-2xl">{recommendedCurrency.flag}</Text>
          </View>
        </View>
      </View>

      {/* ==== App Loader ==== */}
      { (settingsIsLoading || profileIsLoading) && 
        <AppLoader loadingAdditionalMessage={ settingsLoadingMessage || profileLoadingMessage } />
      }
    </SafeAreaView>
  );
};

export default CurrencySettingsScreen;




///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  Card Items Component  ////////////////////////////////

interface ICardItemProps {
  handleOnPress: () => void
  code?: string;
  name?: string;
  symbol?: string;
  flag?: React.ReactNode;
  selected?: boolean
}

const CardItems = (props: ICardItemProps) => {
  const { handleOnPress, code, name, symbol, flag, selected } = props;
  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={{ flex: 1, marginHorizontal: 5, marginBottom: 10 }} // Add spacing between grid items
      activeOpacity={0.8}
    >
      <View
        className={`px-3 py-4 rounded-xl items-start justify-between ${
          selected ? "rounded-xl border border-green-400 bg-[#2590170e]" : "bg-[#F8F9FE]"
        }`}
      >
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-montserratSemiBold text-base text-gray-700">
            {code} ({symbol})
          </Text>
          <View className="h-[40px] w-[40px] items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
            <Text className="text-lg">{flag}</Text>
          </View>
        </View>
        <Text className="mt-1.5 text-[14px]">{name}</Text>
      </View>
    </TouchableOpacity>
  );
};
