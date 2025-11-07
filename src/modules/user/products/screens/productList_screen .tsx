import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import { Image, SafeAreaView, StatusBar, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
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
import useFilterAndSearchHook from '../hooks/filterAndSearch_hook.ts';
import AppLoader from '../../../general/components/appLoader.tsx';
import { setSearchPhrase } from '../slices/product_slice.ts';
import EmptyListComponent from '../../../general/components/emptyList_component.tsx';

interface IProps {
  route: RouteProp<RootNavigationStackModel, 'productListScreen'>;
}

const ProductListScreen: React.FC<IProps> = ({ route }) => {
  const { searchPhrase, dynamicFilterOptions, allProducts, isLoading, loadingMessage } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const screenTitle: string = route.params?.screenTitle ?? "";
  const dispatch = useDispatch();

  // Import Hooks
  const { selectedFilters, toggleCheckboxOption, handleSubmit, handleGetFilteredProducts, handleGetDynamicFilterOptions, handlePrevAndNextPagination, clearAllFilters } = useFilterAndSearchHook();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const setShowBottomSheetModal = useCallback((value: boolean) => {
    if (value) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, []);

  useEffect(() => {
    handleGetFilteredProducts({ screenTitle: screenTitle || "Products", setShowBottomSheetModal });
    handleGetDynamicFilterOptions({});
  }, [selectedFilters]);

  useEffect(() => {
    if (screenTitle === "Shoes") {
      toggleCheckboxOption("Main", "Footwear");
    }
    if (screenTitle === "Female Clothings") {
      toggleCheckboxOption("Main", "Female");
    }
    if (screenTitle === "Male Clothings") {
      toggleCheckboxOption("Main", "Male");
    }
    if (screenTitle === "Accessories" || screenTitle === "Bags") {
      toggleCheckboxOption("Main", "Accessories");
    }
  }, [screenTitle]);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[25px] pt-[20px] pb-3">
          <StatusBar backgroundColor="transparent" barStyle="dark-content" />

          {/*==== Header ====*/}
          <View className="h-auto w-full flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                <ArrowLeft color="white" />
              </View>
            </TouchableOpacity>
            <Text className="font-semibold text-lg text-baseGreen">
              { !screenTitle ? "Products" : screenTitle }
            </Text>
            <View className="h-[40px] w-[40px]" />
          </View>

          {/*==== Search Box ====*/}
          <View className="h-auto w-full mt-8 flex-row items-center justify-center">
            <View className="h-auto w-full px-3 py-1 flex-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                value={searchPhrase}
                placeholder="Search item"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value: string) => dispatch(setSearchPhrase(value))}
              />
              <TouchableOpacity onPress={() => handleSubmit("Search Products")}>
                  <SearchNormal1 color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowBottomSheetModal(true)}>
              <View className="h-[55px] w-[55px] ml-3  flex items-center justify-center rounded-xl bg-gold">
                <Image
                  source={require('../../../../../assets/images/filter.png')}
                  className="h-[25px] w-[25px]"
                />
              </View>
            </TouchableOpacity>
          </View>

          {/*==== Product List ====*/}
          <FlatList
            data={allProducts}
            renderItem={({ item }) => <ProductListCard product={item} />}
            keyExtractor={(_, index) => `${index}-item.productId`}
            showsVerticalScrollIndicator={false}
            className="h-auto w-full mt-3"
            ListEmptyComponent={<EmptyListComponent message={screenTitle + " product yet."} />}
            contentContainerStyle={{ flexGrow: 1 }}
          />


          {/*==== Next and Previous Buttons ====*/}
          <View className="h-auto w-full mt-3 flex-row">
            <TouchableOpacity
                onPress={ () => handlePrevAndNextPagination({screenTitle: screenTitle || "Products", direction: "Prev"}) }
                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
                <ArrowLeft size={ 18 } className="text-baseGreen" />
                <Text className="ml-2 font-montserratSemiBold text-sm text-baseGreen">Prev</Text>
            </TouchableOpacity>
            <View className="w-[10px]" />

            <TouchableOpacity
                onPress={ () => handlePrevAndNextPagination({screenTitle: screenTitle || "Products", direction: "Next"}) }
                className="h-[50px] flex-1 flex-row items-center justify-center rounded-xl bg-lightGreen"
            >
                <Text className="mr-2 font-montserratSemiBold text-sm text-baseGreen">Next</Text>
                <ArrowRight size={ 18 } className="text-baseGreen" />
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

        {/*==== Show app loader ====*/}
        { isLoading && <AppLoader loadingAdditionalMessage={ loadingMessage } /> }
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ProductListScreen;
