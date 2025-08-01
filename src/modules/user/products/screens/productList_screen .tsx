import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
  FlatList,
} from 'react-native';
import {ArrowLeft, SearchNormal1} from 'iconsax-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../redux/store/store.ts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import CategoryFilterBottomSheetComponent from '../components/categoryFilterBottomSheet_component.tsx';
import ProductListCard from '../components/productListCard_component';
import FastImage from 'react-native-fast-image';

interface IProps {
  route: RouteProp<RootNavigationStackModel, 'productListScreen'>;
}

const ProductListScreen: React.FC<IProps> = ({ route }) => {
  const {
    allProducts, femaleClothing, maleClothing, shoes, accessories, bags, popularProducts ,
    newestArrivals, recentlyViewedProducts, recommendedProducts, wishListProducts
  } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const { screenTitle } = route.params || {};
  
  const [isFocused, setIsFocused] = useState(false);
  const iconTranslateX = useRef(new Animated.Value(0)).current;
  const inputTranslateX = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(iconTranslateX, {
        toValue: 220, // Move icon to the right
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(inputTranslateX, {
        toValue: -25, // Move input to the left
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(iconTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(inputTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const AnimatedSearchIcon = Animated.createAnimatedComponent(SearchNormal1);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  const setShowBottomSheetModal = useCallback((value: boolean) => {
    if (value) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, []);

  const products = screenTitle === "All Products" ?
  allProducts
  : screenTitle === "Female Clothings"
  ? femaleClothing
  : screenTitle === "Male Clothings"
  ? maleClothing
  : screenTitle === "Shoes"
  ? shoes
  : screenTitle === "Accessories"
  ? accessories
  : screenTitle === "Bags"
  ? bags
  : screenTitle === "Popular Products"
  ? popularProducts
  : screenTitle === "Newest Arrivals"
  ? newestArrivals
  : screenTitle === "Recently Viewed"
  ? recentlyViewedProducts
  : screenTitle === "Recommended"
  ? recommendedProducts
  : screenTitle === "Wish List"
  ? wishListProducts
  :[];


  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView className="h-full w-full flex-1 px-[25px] pt-[20px]">
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
              <TouchableOpacity onPress={() => null}>
                <Animated.View
                  style={{
                    transform: [{translateX: iconTranslateX}],
                    marginRight: 5,
                  }}>
                  <AnimatedSearchIcon color="#9ca3af" />
                </Animated.View>
              </TouchableOpacity>
              <Animated.View
                style={{
                  flex: 1,
                  transform: [{translateX: inputTranslateX}],
                }}>
                <AnimatedTextInput
                  placeholder="Search item"
                  placeholderTextColor="#9ca3af"
                  className="text-base"
                  onChangeText={value => null}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </Animated.View>
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
            data={products}
            renderItem={({ item }) => <ProductListCard product={item} />}
            keyExtractor={(item, index) => `${index}-item.productId`}
            showsVerticalScrollIndicator={false}
            className="h-auto w-full mt-3"
            ListEmptyComponent={renderEmptyList(screenTitle!)}
            contentContainerStyle={{ flexGrow: 1 }}
          />

          <CategoryFilterBottomSheetComponent
            bottomSheetModalRef={bottomSheetModalRef}
            snapPoints={snapPoints}
            setShowBottomSheetModal={setShowBottomSheetModal}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ProductListScreen;



////////////////////////////////////////////////////////////////////////////////////////////////////////
// Render Empty List
////////////////////////////////////////////////////////////////////////////////////////////////////////

const renderEmptyList = (screenTitle: string) => (
  <View className="h-auto w-full mt-1 p-10 bg-gray-50">
    <FastImage
        source={ require("../../../../../assets/images/empty_box.png") }
        defaultSource={ require("../../../../../assets/images/empty_box.png") }
        resizeMode={ FastImage.resizeMode.contain }
        className="h-[70px] w-full"
    />

    <Text className="mt-4 text-center text-gray-400">You don't have any { screenTitle } products.</Text>
  </View>
);