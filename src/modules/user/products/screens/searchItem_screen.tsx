import React, { useEffect, useMemo, useRef } from 'react'
import { ActivityIndicator, Image, SafeAreaView, StatusBar, Text, TextInput, View } from 'react-native';
import { ArrowLeft, Filter, SearchNormal1 } from 'iconsax-react-native';
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
import DynamicFilterBottomSheetComponent from '../components/dynamicFilterBottomSheet_component.tsx';


const SearchItemScreen = () => {
  const { searchPhrase } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    results, isFetching, isUninitialized, handleSearchNow, recentSearches, removeRecentSearch, selectRecentSearch,
    selectedFilters, toggleCheckboxOption, clearAllFilters, dynamicFilterOptions, filtersLoading,
    activeFilterCount, showBottomSheetModal, setShowBottomSheetModal, handleOpenFilters,
  } = useSearchHook();
  const bottomSheetModalRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    if (showBottomSheetModal) { bottomSheetModalRef.current?.present(); }
    else { bottomSheetModalRef.current?.dismiss(); }
  }, [showBottomSheetModal]);
  const hasSearchPhrase = !!searchPhrase?.trim();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 pt-5">
          <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
          />

          {/*==== Header ====*/}
          <View className="h-auto w-full px-5 flex-row items-center justify-between">
            <TouchableOpacity onPress={ () => navigation.goBack() }>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">Search Item</Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          <View className="px-5">
            {/*==== Search Box ====*/}
            <View className="h-auto w-full mt-5 flex-row items-center justify-between">
              <TextInput
                  aria-label="Title"
                  aria-labelledby="title"
                  keyboardType="default"
                  placeholder="Search item"
                  placeholderTextColor="#9ca3af"
                  className="h-[44px] px-3 py-3 flex-row flex-1 items-center justify-between border border-gray-300 rounded-xl bg-gray-100"
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

              <TouchableOpacity onPress={ handleOpenFilters }>
                <View className="h-[55px] w-[55px] ml-2 flex items-center justify-center rounded-xl border border-gray-300 bg-gray-100">
                  <Filter className="text-baseGreen" />
                  { activeFilterCount > 0 && (
                    <View className="h-5 w-5 absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-baseGreen">
                      <Text className="text-[10px] text-white">{ activeFilterCount }</Text>
                    </View>
                  ) }
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
                      <EmptyListComponent message="No matching products yet." standalone />
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

          <DynamicFilterBottomSheetComponent
            bottomSheetModalRef={ bottomSheetModalRef }
            snapPoints={ snapPoints }
            setShowBottomSheetModal={ setShowBottomSheetModal }
            selectedFilters={ selectedFilters }
            toggleCheckboxOption={ toggleCheckboxOption }
            clearAllFilters={ clearAllFilters }
            dynamicFilterOptions={ dynamicFilterOptions }
            isloading={ filtersLoading }
            loadingMessage="Loading filters..."
          />

        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default SearchItemScreen;