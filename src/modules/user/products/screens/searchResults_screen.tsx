import React, {useEffect} from 'react'
import { FlatList, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { ArrowLeft } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store.ts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import AppLoader from '../../../general/components/appLoader.tsx';
import useFilterAndSearchHook from '../hooks/filterAndSearch_hook.ts';
import ProductListCard from '../components/productListCard_component.tsx';
import EmptyListComponent from '../../../general/components/emptyList_component';


const SearchResultsScreen = () => {
  const { allProducts, searchPhrase, isLoading, loadingMessage } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  // console.log("PRODUCT::: ", products);
  
  const { handleSubmit } = useFilterAndSearchHook();

  useEffect(() => {
    (async () => {
      await handleSubmit("Search Results");
    })();
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[20px] pt-[20px]">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          {/*==== Header ====*/}
          {/* <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={ () => navigation.goBack() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">Search Results</Text>
            <View className="h-[40px] w-[40px]" />
          </View> */}

          <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">Search Results</Text>
            <View className="h-[40px] w-[40px]" />
          </View>


          
          {/*==== Product List ====*/}
          <Text className="mt-5 font-montserratMedium">{ allProducts.length } { allProducts.length > 1 ? "items" : "item" } were found</Text>
          <FlatList
            data={allProducts}
            renderItem={({ item }) => <ProductListCard product={item} />}
            keyExtractor={(item, index) => `${index}-item.productId`}
            showsVerticalScrollIndicator={false}
            className="h-auto w-full"
            ListEmptyComponent={<EmptyListComponent message="search result" />}
            contentContainerStyle={{ flexGrow: 1 }}
          />

        </SafeAreaView>

        { (isLoading) && (
            <AppLoader loadingAdditionalMessage={loadingMessage} />
        ) }
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default SearchResultsScreen;