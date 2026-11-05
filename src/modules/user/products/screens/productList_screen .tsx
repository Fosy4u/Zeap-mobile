import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { ActivityIndicator, Image, SafeAreaView, StatusBar, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import {ArrowLeft, ArrowRight, SearchNormal1} from 'iconsax-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store/store.ts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import DynamicFilterBottomSheetComponent from '../components/dynamicFilterBottomSheet_component.tsx';
import ProductListCard from '../components/productListCard_component';
import useFilterAndSearchHook, { PAGE_SIZE, getTotalPages } from '../hooks/filterAndSearch_hook.ts';
import { setAllProducts, setIsLoading, setSearchPhrase } from '../slices/product_slice.ts';
import EmptyListComponent from '../../../general/components/emptyList_component.tsx';
import ProductListSkeletonLoader from '../components/productListSkeletonLoader_component.tsx';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook.ts';


interface IProps {
  route: RouteProp<RootNavigationStackModel, 'productListScreen'>;
}

const ProductListScreen: React.FC<IProps> = ({ route }) => {
  const { searchPhrase, dynamicFilterOptions, allProducts, isLoading, loadingMessage, currentPage, productsTotalCount } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const screenTitle: string = route.params?.screenTitle ?? "";
  const routeFilters = route.params?.filters;
  const source = route.params?.source;
  const dispatch = useDispatch();

  // Import Hooks
  const { selectedFilters, selectedFiltersCount, toggleCheckboxOption, preselectCategoryFilters, handleSubmit, handleGetFilteredProducts, handleGetDynamicFilterOptions, handlePrevAndNextPagination, clearAllFilters } = useFilterAndSearchHook();
  const { currencyRefreshToken } = useDisplayCurrency();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const productListRef = useRef<FlatList>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const [paginatingDirection, setPaginatingDirection] = useState<"Prev" | "Next" | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const isPrevDisabled = !!paginatingDirection || currentPage <= 1;
  const totalPages = getTotalPages(productsTotalCount);
  const isLastPage = totalPages !== null ? currentPage >= totalPages : allProducts.length < PAGE_SIZE;
  const isNextDisabled = !!paginatingDirection || reachedEnd || isLastPage;

  const handlePaginate = async (direction: "Prev" | "Next") => {
    if (paginatingDirection) return;
    setPaginatingDirection(direction);
    try {
      const { pageChanged, reachedEnd: hitEnd } = await handlePrevAndNextPagination({ screenTitle: screenTitle || "Products", direction, filters: routeFilters, source });
      if (hitEnd) setReachedEnd(true);
      if (pageChanged) {
        if (direction === "Prev") setReachedEnd(false);
        productListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }
    } finally {
      setPaginatingDirection(null);
    }
  };

  const setShowBottomSheetModal = useCallback((value: boolean) => {
    if (value) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, []);

  useLayoutEffect(() => {
    setReachedEnd(false);
    dispatch(setAllProducts([]));
    dispatch(setIsLoading(true));
  }, [screenTitle, routeFilters]);

  const [productsFetched, setProductsFetched] = useState(false);

  useEffect(() => {
    setProductsFetched(false);
    setReachedEnd(false);
    (async () => {
      try {
        await handleGetFilteredProducts({ screenTitle: screenTitle || "Products", filters: routeFilters, source, setShowBottomSheetModal });
      } finally {
        setProductsFetched(true);
      }
    })();
    handleGetDynamicFilterOptions({});
  }, [screenTitle, routeFilters, source, selectedFilters, currencyRefreshToken]);

  const seededTitleRef = useRef<string | null>(null);
  useEffect(() => {
    if (!dynamicFilterOptions || dynamicFilterOptions.length === 0) return;
    if (seededTitleRef.current === screenTitle) return;
    seededTitleRef.current = screenTitle;
    preselectCategoryFilters(screenTitle);
  }, [dynamicFilterOptions, screenTitle]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 pt-5 pb-3">
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />

          {/*==== Header ====*/}
          <View className="h-auto w-full px-5 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="flex-1 mx-3 text-center font-semibold text-lg text-baseGreen" numberOfLines={ 1 }>
              { !screenTitle ? "Products" : screenTitle }
            </Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          {/*==== Search Box ====*/}
          <View className="h-auto w-full mt-8 px-5 flex-row items-center justify-center">
            <View className="h-auto w-full px-3 py-1 flex-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                value={searchPhrase}
                placeholder="Search item"
                placeholderTextColor="#9ca3af"
                className="h-[44px] flex-1 text-base"
                onChangeText={(value: string) => dispatch(setSearchPhrase(value))}
              />
              <TouchableOpacity onPress={() => handleSubmit("Search Products")}>
                  <SearchNormal1 color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowBottomSheetModal(true)}>
              <View className="h-[55px] w-[55px] ml-3 relative flex items-center justify-center rounded-xl bg-gold">
                <Image
                  source={require('../../../../../assets/images/filter.png')}
                  className="h-[25px] w-[25px]"
                />
                { selectedFiltersCount > 0 && (
                  <View className="absolute -top-1.5 -right-1.5 h-[20px] min-w-[20px] px-1 flex items-center justify-center rounded-full bg-baseGreen border border-white">
                    <Text className="font-montserratSemiBold text-[10px] text-white">{ selectedFiltersCount }</Text>
                  </View>
                ) }
              </View>
            </TouchableOpacity>
          </View>

          {/*==== Product List ====*/}
          { (!productsFetched || (isLoading && allProducts.length === 0)) ? (
            <View className="mt-3 px-5 flex-1">
              <ProductListSkeletonLoader />
            </View>
          ) : (
            <FlatList
              ref={productListRef}
              data={allProducts}
              renderItem={({ item }) => <ProductListCard product={item} />}
              keyExtractor={(_, index) => `${index}-item.productId`}
              showsVerticalScrollIndicator={false}
              className="h-auto w-full mt-3"
              ListEmptyComponent={ (source === "Promo Products")
                ? <EmptyListComponent standalone title="No Product Found" message="No product matches your search criteria, please try again later." />
                : <EmptyListComponent standalone message={`No ${(screenTitle || "products").toLowerCase()} found.`} /> }
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
            />
          ) }

          {/*==== Next and Previous Buttons ====*/}
          <View className="h-auto w-full mt-3 px-5 flex-row">
            <TouchableOpacity
                onPress={ () => handlePaginate("Prev") }
                disabled={ isPrevDisabled }
                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
                { paginatingDirection === "Prev" ? (
                  <ActivityIndicator size="small" color="#112F1E" />
                ) : (
                  <View className="flex-row items-center" style={{ opacity: isPrevDisabled ? 0.4 : 1 }}>
                    <ArrowLeft size={ 18 } className="text-baseGreen" />
                    <Text className="ml-2 font-montserratSemiBold text-sm text-baseGreen">Prev</Text>
                  </View>
                ) }
            </TouchableOpacity>
            <View className="w-[10px]" />

            <TouchableOpacity
                onPress={ () => handlePaginate("Next") }
                disabled={ isNextDisabled }
                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
                { paginatingDirection === "Next" ? (
                  <ActivityIndicator size="small" color="#112F1E" />
                ) : (
                  <View className="flex-row items-center" style={{ opacity: isNextDisabled ? 0.4 : 1 }}>
                    <Text className="mr-2 font-montserratSemiBold text-sm text-baseGreen">Next</Text>
                    <ArrowRight size={ 18 } className="text-baseGreen" />
                  </View>
                ) }
            </TouchableOpacity>
          </View>

          <DynamicFilterBottomSheetComponent
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            setShowBottomSheetModal={setShowBottomSheetModal}
            selectedFilters={selectedFilters}
            toggleCheckboxOption={toggleCheckboxOption}
            clearAllFilters={clearAllFilters}
            dynamicFilterOptions={dynamicFilterOptions}
            isloading={isLoading}
            loadingMessage={loadingMessage}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ProductListScreen;
