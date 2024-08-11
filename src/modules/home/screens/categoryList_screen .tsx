import React, { useCallback, useMemo, useRef } from 'react'
import { Image, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import { ArrowLeft, Heart, SearchNormal1, Star1 } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import CategoryFilterBottomSheetComponent from '../components/categoryFilterBottomSheet_component';

interface IProps {
  route: RouteProp<RootNavigationStackModel, "categoryListScreen">;
}

const CategoryListScreen: React.FC<IProps> = ({ route }) => {
  const { screenTitle } = route.params || {};
  const { bestDeals } = useSelector((state: RootState) => state.homeState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["100%"], []);

  const setShowBottomSheetModal = useCallback((value: boolean) => {
    if (value === true) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[25px] pt-[20px]">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          {/*==== Header ====*/}
          <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={ () => navigation.pop() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">{ screenTitle }</Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          {/*==== Search Box ====*/}
          <View className="h-auto w-full mt-8 flex-row items-center justify-center">
            <View className="h-auto w-full px-3 py-1 flex-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
              <TouchableOpacity onPress={ () => null }>
                  <SearchNormal1 color="#9ca3af" className="mr-2" />
              </TouchableOpacity>
              <TextInput
                  placeholder="Search item"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-base"
                  onChangeText={(value) => null}
              />
            </View>

            <TouchableOpacity onPress={ () => setShowBottomSheetModal(true) }>
              <View className="h-[55px] w-[55px] ml-3  flex items-center justify-center rounded-xl bg-gold">
                <Image
                  source={ require("../../../assets/filter.png") }
                  className="h-[25px] w-[25px]"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/*==== Category List ====*/}
          <ScrollView showsVerticalScrollIndicator={false} 
            className="h-auto w-full mt-3">
            { bestDeals.map((bestDeal) => (
              <TouchableOpacity key={ bestDeal.id }
                onPress={ () => null }
              >
                <View className="h-auto w-full mt-4 p-4 flex-row rounded-xl bg-[#F8F9FE]">
                  <View className="h-[150px] w-[130px] relative mr-4 py-2 flex justify-center rounded-xl bg-white">
                    <Image
                      className="h-[120px] w-full rounded-t-2xl"
                      resizeMode="contain"
                      source={ bestDeal.image }
                    />
                    <View className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                      <Heart color="gray" />
                    </View>
                  </View>

                  <View className="w-[160px] mt-3">
                    <Text className="text-base text-gray-800">{ bestDeal.name }</Text>
                    <View className="mt-3 flex-row items-center justify-between">
                      <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ bestDeal.productType }</Text>

                      <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                      </View>
                    </View>
                    <Text className="mt-2.5 text-base font-medium text-gray-900">${ bestDeal.price }</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )) }
          </ScrollView>

          <CategoryFilterBottomSheetComponent bottomSheetModalRef={ bottomSheetModalRef } snapPoints={ snapPoints }  setShowBottomSheetModal={ setShowBottomSheetModal } />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default CategoryListScreen;