import React from 'react'
import { Image, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { ArrowLeft } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';

const AllCategoryScreen = () => {
  const { categories } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  return (
    <GestureHandlerRootView>
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
          <Text className="font-semibold text-lg text-baseGreen">All Categories</Text>
          <View className="h-[40px] w-[40px]" />
        </View>

        {/*==== Category List ====*/}
        <ScrollView showsVerticalScrollIndicator={false} className="mt-3">
          { categories.map((category) => (
            <TouchableOpacity key={ category.id }
              onPress={ () => navigation.navigate("productListScreen", { screenTitle: category.name }) }>
              <View className="h-[105px] w-full relative mt-10 p-5 flex justify-center rounded-2xl border"
                style={{
                  backgroundColor: category.color[0],
                  borderColor: category.color[1],
                }}
              >
                <View>
                  <Text className="h-auto w-[125px] text-[22px] text-gray-800">{ category.name }</Text>
                  <Text className="text-xs text-gray-600">{ category.totalCount } items</Text>
                </View>

                <Image
                  source={ category.image }
                  resizeMode="contain"
                  className="h-[135px] w-[125px] absolute bottom-0 right-0"
                />
              </View>
            </TouchableOpacity>
          )) }
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default AllCategoryScreen;