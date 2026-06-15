import React from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ShopAdd, Home, ShoppingBag, Heart, Profile } from 'iconsax-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';

const { width } = Dimensions.get('window');
const tabWidth = width / 5;
const height = 72;

const AppBottomBarComponent = ({ state, descriptors, navigation }: any) => {
  // Live cart-item count for the Cart tab badge. basketItems is the canonical
  // array — bespoke + ready-made entries both land there. Falls back to 0
  // when the cart hasn't been hydrated yet so we never flash a stale number.
  const cartCount = useSelector(
    (rootState: RootState) => rootState.cartState?.cart?.basketItems?.length ?? 0,
  );
  // The shop FAB always lands on the vendor onboarding pitch — the pitch's
  // own CTA branches the user from there: "Become a vendor" if they have no
  // shop, "My shop" if they already do (routing to welcome / dashboard based
  // on the shop's status). Keeping one entry point makes the buyer FAB
  // behavior uniform regardless of `userData.isVendor`.
  const handleShopFabPress = () => {
    const parent = navigation.getParent() ?? navigation;
    parent.navigate("vendorOnboardingScreen");
  };
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
            // canPreventDefault: true is required so listeners can call
            // event.preventDefault() (used by the vendor Market tab to redirect
            // to the buyer home stack, and reserved for future tab interceptors).
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          let bottomNavIcon;
          if (route.name === "Cart") {
            bottomNavIcon = <ShoppingBag size={23} color={ isFocused ? "#FFFFFF" : "#AEAFB0" } variant={isFocused ? "Bold" : "Linear"}  />;
          } else if (route.name === "Home") {
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

              {/* Cart-count badge — overlays the Cart icon, hidden when 0.
                  "9+" caps the visual width so a long number doesn't break
                  the badge's circular shape. */}
              { route.name === "Cart" && cartCount > 0 && (
                <View
                  className="absolute -top-1 -right-1 px-1 items-center justify-center rounded-full bg-red-500"
                  style={{ minWidth: 18, height: 18 }}
                >
                  <Text className="font-montserratSemiBold text-[10px] text-white">
                    { cartCount > 9 ? "9+" : cartCount }
                  </Text>
                </View>
              ) }
              </View>
              <Text className={ `text-[9px] ${ isFocused ? "text-white" : "text-gray-400" }` }>{ label }</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/*==== FAB ====*/}
      {/* The shop FAB has two destinations gated on userData.isVendor:
          non-vendors get the onboarding stepper, vendors jump straight into
          their admin dashboard. Both routes live at root-stack level so we
          reach past the tab navigator to push them. */}
      <View className="absolute self-center bottom-[42px]">
        <TouchableOpacity
          className="h-[40px] w-[40px] rounded-full bg-baseGreen justify-center items-center shadow-md"
          onPress={ handleShopFabPress }
        >
          <ShopAdd size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppBottomBarComponent;