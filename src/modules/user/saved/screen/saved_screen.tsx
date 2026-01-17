import { useSelector } from 'react-redux';
import { Notification, SearchNormal1 } from 'iconsax-react-native';
import React, { useRef, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Animated, Image, TextInput, FlatList } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setShowBottomSheetModal } from '../../../auths/slices/authState_slice';
import { RootState } from '../../../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import SavedProductCard from '../components/savedProductCard_component';

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
  
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1 px-5 pt-2 pb-0">

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
            onPress={ () => navigation.navigate("userNotificationsScreen") }
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
                source={ require("../../../../../assets/images/filter.png") }
                className="h-[25px] w-[25px]"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View className="h-5" />

        <FlatList 
          className="h-auto w-full"
          data={popularProducts}
          renderItem={({ item }) => <SavedProductCard product={item} />}
          keyExtractor={(item) => item.productId}
          numColumns={2}
          columnWrapperStyle={{
            gap: 10,
            marginBottom: 10,
          }}
          showsVerticalScrollIndicator={false} 
        />

      </SafeAreaView>
      
      <View className="h-20" />
    </GestureHandlerRootView>
  )
}

export default SavedScreen;