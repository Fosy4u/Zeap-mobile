import React from 'react'
import { ActivityIndicator, Image, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import { ArrowLeft, SearchNormal1 } from 'iconsax-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider, TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import useSearchHook from '../hooks/search_hook.ts';
import { setProductID, setSearchPhrase } from '../slices/product_slice.ts';
import ProductCardComponent from '../../../general/components/productCard_component.tsx';
import EmptyListComponent from '../../../general/components/emptyList_component.tsx';


const SearchItemScreen = () => {
  const { searchPhrase } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch<AppDispatch>();

  // Debounced search via /products/live/searchProducts. Typing fires the
  // search after a 500ms pause; tapping the search icon triggers it now AND
  // persists the term to the recent-searches list (max 5, secure storage).
  const { results, isFetching, isUninitialized, handleSearchNow, recentSearches, removeRecentSearch, selectRecentSearch } = useSearchHook();
  const hasSearchPhrase = !!searchPhrase?.trim();

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

              <TouchableOpacity onPress={ handleSearchNow }>
                <View className="h-[55px] w-[55px] ml-3 flex items-center justify-center rounded-xl bg-gold">
                  <SearchNormal1 className="text-baseGreen" />
                </View>
              </TouchableOpacity>
            </View>

            {/*==== Results / Recent searches ====*/}
            <ScrollView
              showsVerticalScrollIndicator={ false }
              className="h-auto w-full mt-4"
              keyboardShouldPersistTaps="handled"
            >
              { hasSearchPhrase ? (
                <View>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-montserratSemiBold text-base text-baseGreen">
                      Results for "{ searchPhrase.trim() }"
                    </Text>
                    { isFetching && <ActivityIndicator size="small" color="#133522" /> }
                  </View>

                  { !isFetching && !isUninitialized && results.length === 0 ? (
                    <View className="mt-6">
                      <EmptyListComponent message="No matching products yet." />
                    </View>
                  ) : (
                    <View className="mt-3 flex-row flex-wrap justify-between">
                      { results.map((product) => (
                        <View key={ product.productId } className="w-[48%] mb-3">
                          <ProductCardComponent
                            product={ product }
                            orientation="Vertical"
                            gridItem
                            handleOnPress={ () => {
                              dispatch(setProductID(product.productId));
                              navigation.navigate("productDetailScreen");
                            } }
                          />
                        </View>
                      )) }
                    </View>
                  ) }
                </View>
              ) : (
                <View>
                  <Text className="font-montserratSemiBold text-base text-baseGreen">Recent searches</Text>

                  { recentSearches.length === 0 ? (
                    <Text className="mt-3 font-montserratMedium text-sm text-gray-400">No recent searches yet.</Text>
                  ) : (
                    recentSearches.map((recentPhrase, index) => (
                      <TouchableOpacity key={ index }
                        onPress={ () => selectRecentSearch(recentPhrase) }
                      >
                        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
                          <View className="py-3 flex-row flex-1 items-center justify-start ">
                            <SearchNormal1 size={18} color="#A8ACB8" className="mr-4" />
                            <Text className="font-montserratMedium text-base">{ recentPhrase }</Text>
                          </View>

                          <TouchableOpacity
                            onPress={ () => removeRecentSearch(recentPhrase) }
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Image
                              className="h-[22px] w-[22px]"
                              source={ require("../../../../../assets/images/close.png") }
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) }
                </View>
              ) }
            </ScrollView>
          </View>
          
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default SearchItemScreen;