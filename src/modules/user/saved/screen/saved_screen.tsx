import { useSelector } from 'react-redux';
import { Heart, Notification, SearchNormal1, Star1 } from 'iconsax-react-native';
import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Animated, Image, TextInput, FlatList } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setShowBottomSheetModal } from '../../../auths/slices/authState_slice';
import { RootState } from '../../../../redux/store/store';
import IProduct from '../../product/models/product_model';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';


const SavedScreen = () => {
  const { popularProducts } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>()

  const [isFocused, setIsFocused] = useState(false);
  const iconTranslateX = useRef(new Animated.Value(0)).current;
  const inputTranslateX = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(iconTranslateX, {
        toValue: 220, // Move icon to the right
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(inputTranslateX, {
        toValue: -25, // Move input to the left
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(iconTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(inputTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const AnimatedSearchIcon = Animated.createAnimatedComponent(SearchNormal1);
  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

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
            : require("../../../../assets/app_logo.png")
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
      <SafeAreaView className="h-full w-full flex-1 px-5 pt-2 pb-3">

        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        {/*==== Header ====*/}
        <View className="h-auto w-full py-3 flex-row items-center justify-between">
          <View className="h-[40px] w-[40px]" />
          <Text className="font-semibold text-lg text-baseGreen">My Favorites</Text>
          <TouchableOpacity
            className="bg-lightGreen p-2.5 rounded-full"
            onPress={ () => null }
          >
            <Notification color="#133522" size={24} variant="Bold" />
          </TouchableOpacity>
        </View>

        {/*==== Search Box ====*/}
        <View className="h-auto w-full mt-3 flex-row items-center justify-center">
          <View className="h-auto w-full px-3 py-1 flex-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
            <TouchableOpacity onPress={() => null}>
              <Animated.View style={{ 
                transform: [{ translateX: iconTranslateX }],
                marginRight: 5 
              }}>
                <AnimatedSearchIcon 
                  color="#9ca3af" 
                />
              </Animated.View>
            </TouchableOpacity>
            <Animated.View style={{ 
              flex: 1,
              transform: [{ translateX: inputTranslateX }]
            }}>
              <AnimatedTextInput
                placeholder="Search item"
                placeholderTextColor="#9ca3af"
                className="text-base"
                onChangeText={(value) => null}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </Animated.View>
          </View>

          <TouchableOpacity onPress={ () => setShowBottomSheetModal(true) }>
            <View className="h-[55px] w-[55px] ml-3  flex items-center justify-center rounded-xl bg-gold">
              <Image
                source={ require("../../../../assets/filter.png") }
                className="h-[25px] w-[25px]"
              />
            </View>
          </TouchableOpacity>
        </View>

        <FlatList 
          className="h-auto w-full mt-4"
          data={popularProducts}
          renderItem={ renderProduct }
          keyExtractor={(item) => item.productId}
          numColumns={2}
          columnWrapperStyle={{
            gap: 10,
            marginBottom: 10,
          }}
          showsVerticalScrollIndicator={false} 
        />

      </SafeAreaView>
      <Text>SavedScreen</Text>
    </GestureHandlerRootView>
  )
}

export default SavedScreen;