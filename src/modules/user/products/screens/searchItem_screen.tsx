import React, {useEffect, useState} from 'react'
import { Image, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import { ArrowLeft, SearchNormal1 } from 'iconsax-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import useFilterAndSearchHook from '../hooks/filterAndSearch_hook.ts';
import { setSearchPhrase } from '../slices/product_slice.ts';


const SearchItemScreen = () => {
  const { filteredSearchPhrases, searchPhrase } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch<AppDispatch>();

  const { handleSubmit } = useFilterAndSearchHook();

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[20px] pt-[20px]">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          {/*==== Header ====*/}
          <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={ () => navigation.goBack() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">Search Item</Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          <View>
            {/*==== Search Box ====*/}
            <View className="h-auto w-full mt-5 flex-row items-center justify-between">
              <TextInput
                  aria-label="Title"
                  aria-labelledby="title"
                  keyboardType="default"
                  placeholder="Search item"
                  placeholderTextColor="#9ca3af"
                  className="h-auto px-3 py-3 flex-row flex-1 items-center justify-between border border-gray-300 rounded-xl bg-gray-100"
                  onChangeText={(value) => {
                    dispatch(setSearchPhrase(value));
                  }}
                  value={ searchPhrase }
              />

              <TouchableOpacity onPress={ () => {
                handleSubmit("Search Products");
              } }>
                <View className="h-[55px] w-[55px] ml-3 flex items-center justify-center rounded-xl bg-gold">
                  <SearchNormal1 className="text-baseGreen" />
                </View>
              </TouchableOpacity>
            </View>

            <View className="bg-blue-300">
            </View>
            

            {/*==== Product List ====*/}
            <ScrollView
              showsVerticalScrollIndicator={false} 
              className="h-auto w-full mt-2"
            > 
              <Text className="font-montserratSemiBold text-base text-baseGreen">Recent searches</Text>

              {
                filteredSearchPhrases.map((searchPhrase, index) => (
                  <TouchableOpacity key={ index }
                    onPress={ () => null }
                  >
                    <View className="h-auto w-full mt-3 flex-row items-center justify-between">
                      <View className="py-3 flex-row flex-1 items-center justify-start ">
                        <SearchNormal1 size={18} color="#A8ACB8" className="mr-4" />
                        <Text className="font-montserratMedium text-base">{ searchPhrase }</Text>
                      </View>

                      <TouchableOpacity onPress={ () => null }>
                        <Image
                          className="h-[22px] w-[22px]"
                          source={ require("../../../../../assets/images/close.png") }
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          </View>
          
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default SearchItemScreen;