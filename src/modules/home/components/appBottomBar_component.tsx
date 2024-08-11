import React from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ShopAdd, Home, ShoppingBag, Heart, Profile } from 'iconsax-react-native';

const { width } = Dimensions.get('window');
const tabWidth = width / 5;
const height = 72;

const AppBottomBarComponent = ({ state, descriptors, navigation }: any) => {
  const getPath = () => {
    const left = tabWidth * 2.01;
    const right = tabWidth * 3.0;
    const mid = (left + right) / 2;
  
    return `M0,0
      H${left}
      C${left + tabWidth / 3.5},0 ${left + tabWidth / 6.8},${height / 2.2} ${mid},${height / 2.15}
      C${right - tabWidth / 6.8},${height / 2.2} ${right - tabWidth / 3.5},0 ${right},0
      H${width}
      V${height}
      H0
      V0
      Z`;
  };

  return (
    <View className="h-auto w-full absolute bottom-0">
      <Svg width={width} height={height}>
        <Path d={getPath()} fill="#133522" />
      </Svg>
      <View className="h-auto w-full absolute top-3 flex-row items-center justify-around">
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
          if (route.name === "Cart") {
            bottomNavIcon = <ShoppingBag size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          } else if (route.name === "Dashboard") {
            bottomNavIcon = <Home size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"} />;
          } else if (route.name === "Saved") {
            bottomNavIcon = <Heart size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          } else if (route.name === "Profile") {
            bottomNavIcon = <Profile size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              className="flex justify-center items-center"
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

      {/*==== FAB ====*/}
      <View className="absolute self-center bottom-[42px]">
        <TouchableOpacity 
          className="h-[40px] w-[40px] rounded-full bg-baseGreen justify-center items-center shadow-md"
          onPress={() => {}}
        >
          <ShopAdd size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppBottomBarComponent;