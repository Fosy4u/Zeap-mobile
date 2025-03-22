import React, {useEffect} from 'react'
import { Image, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { ArrowLeft, Heart, Star1 } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import IProduct from '../models/product_model.ts';
import AppLoader from '../../../general/components/appLoader.tsx';
import useSearchHook from '../hooks/search_hook.ts';


const SearchResultsScreen = () => {
  const { products, searchWord } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  // console.log("PRODUCT::: ", products);
  
  const { handleSubmit, isLoading } = useSearchHook();

  useEffect(() => {
    (async () => {
      await handleSubmit(searchWord);
    })();
  }, []);


  const renderProduct = ({ item }: { item: IProduct }) => (
    <TouchableOpacity
      onPress={ () => navigation.navigate("productDetailScreen") }
      className="h-auto w-full flex-1 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
    >
      <View className="h-auto w-full relative py-1 rounded-xl bg-white">
        <Image
          className="h-[100px] w-full rounded-t-2xl"
          resizeMode="contain"
          source={ 
            item.colors[0]?.images[1]?.link
            ? { uri: item.colors[0]?.images[1]?.link }
            : require("../../../../../assets/images/app_logo.png")
          }
        />
        <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
          <Heart color="gray" />
        </View>
      </View>
      <View className="mt-3">
        <Text className="text-sm text-gray-800">{ item.title }</Text>
        <View className="mt-1.5 flex-row items-center justify-between">
          <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">
            { item.categories.productGroup.split("-").join(" ") }
          </Text>

          <View className="flex-row">
            <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
            <Text>4.3</Text>
          </View>
        </View>
        <Text className="mt-2.5 text-base font-medium text-gray-900">
          ₦{ item.variations[0].price.toLocaleString() }
        </Text>
      </View>
    </TouchableOpacity>
  );

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
            <Text className="font-semibold text-lg text-baseGreen">Search Results</Text>
            <View className="h-[40px] w-[40px]" />
          </View>


          
          {/*==== Product List ====*/}
          { (!isLoading) ? (
              <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="h-auto w-full mt-2"
              >
                <Text className="font-montserratSemiBold text-base text-baseGreen">{searchWord}</Text>
                <Text>{ products.length } { products.length > 1 ? "items" : "item" } were found</Text>
                {products.map((product: IProduct) => (
                    <TouchableOpacity key={product?.productId}
                                      onPress={() => {
                                        navigation.navigate("productDetailScreen", {productID: product.productId});
                                      }}
                    >
                      <View className="h-auto w-full mt-4 p-4 flex-row rounded-xl bg-[#F8F9FE]">
                        <View
                            className="h-[150px] w-[130px] relative mr-4 py-2 flex justify-center items-center rounded-xl bg-white">
                          <Image
                              className="h-[120px] w-[90px] rounded-2xl"
                              resizeMode="cover"
                              source={
                                product.colors[0]?.images[1]?.link
                                    ? {uri: product.colors[0]?.images[1]?.link}
                                    : require("../../../../../assets/images/app_logo.png")
                              }
                          />
                          <View
                              className="h-[35px] w-[35px] absolute top-2 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                            <Heart color="gray"/>
                          </View>
                        </View>

                        <View className="w-[160px] mt-3">
                          <Text className="text-base text-gray-800">{product.title}</Text>
                          <View className="mt-3 flex-row items-center justify-between">
                            <Text
                                className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{product.categories.productGroup.split("-").join(" ")}</Text>

                            <View className="flex-row">
                              <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5"/>
                              <Text>4.3</Text>
                            </View>
                          </View>
                          <Text
                              className="mt-2.5 text-base font-medium text-gray-900">₦{product.variations[0].price.toLocaleString()}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                ))}
              </ScrollView>
          ) : (
              <AppLoader />
          ) }

        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default SearchResultsScreen;