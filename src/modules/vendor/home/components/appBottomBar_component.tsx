import React from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Home, ShoppingBag, Heart, Profile, Shop } from 'iconsax-react-native';

const { width } = Dimensions.get('window');
const tabWidth = width / 5;
const height = 72;

const AppBottomBarComponent = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {

  return (
    // <View className="h-auto w-full fixed bottom-0 ">

      <View className="h-auto w-full py-4 flex-row items-center justify-around rounded-t-3xl bg-[#133522]">
        {state.routes.map((route: { key: string | number; name: string; }, index: React.Key | null | undefined) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          let bottomNavIcon;
          if (route.name === "Products") {
            bottomNavIcon = <ShoppingBag size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          } else if (route.name === "Dashboard") {
            bottomNavIcon = <Home size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"} />;
          } else if (route.name === "Orders") {
            bottomNavIcon = <Heart size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          } else if (route.name === "Profile") {
            bottomNavIcon = <Profile size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          } else if (route.name === "Market") {
            bottomNavIcon = <Shop size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              className="flex justify-center items-center gap-1"
            >
              <View className="h-[42px] w-[42px] flex items-center justify-center rounded-2xl bg-white/[.2]">
                { bottomNavIcon }
                { isFocused && <View className="h-[4px] w-[4px] mt-0.5 rounded-full bg-white" /> }
              </View>
              <Text className={ `text-[9px] ${ isFocused ? "text-white" : "text-gray-400" }` }>{ label }</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      // {/*==== FAB ====*/}
      // {/* <View className="absolute self-center bottom-[42px]">
      //   <TouchableOpacity 
      //     className="h-[40px] w-[40px] rounded-full bg-baseGreen justify-center items-center shadow-md"
      //     onPress={() => {}}
      //   >
      //     <ShopAdd size={20} color="white" />
      //   </TouchableOpacity>
      // </View> */}
    // </View>
  );
};

export default AppBottomBarComponent;