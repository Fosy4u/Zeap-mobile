import AuthCheck from '../../../auths/components/authCheck';
import { CloseCircle, Notification, SearchNormal1 } from 'iconsax-react-native';
import NotificationBadgeComponent from '../../../notifications/components/notificationBadge_component';
import React, { useCallback, useMemo, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import SavedProductCard from '../components/savedProductCard_component';
import useSavedHook from '../hooks/saved_hook';
import EmptyListComponent from '../../../general/components/emptyList_component';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { clearPendingDestination } from '../../../auths/slices/authState_slice';

const SavedScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>()
  const dispatch = useDispatch();
  const isGuest = useSelector((state: RootState) => !!state.profileState.userData?.isGuest);
  const { wishItems, isWishlistLoading, isWishlistFetching, refetch } = useSavedHook();
  const savedProducts = useMemo(() => wishItems.map((item) => item.product).filter(Boolean), [wishItems]);

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  const [searchPhrase, setSearchPhrase] = useState("");
  const visibleProducts = useMemo(() => {
    const phrase = searchPhrase.trim().toLowerCase();
    if (!phrase) { return savedProducts; }

    return savedProducts.filter((product) => [
      product?.title,
      product?.categories?.brand,
      product?.categories?.productGroup,
      product?.productType,
    ].some((field) => String(field ?? "").toLowerCase().includes(phrase)));
  }, [savedProducts, searchPhrase]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="h-full w-full flex-1 pt-2 pb-0">

        <StatusBar
            backgroundColor="transparent"
            barStyle="dark-content"
        />

        {/*==== Header ====*/}
        <View className="h-auto w-full px-5 py-3 flex-row items-center justify-between">
          <View className="h-[40px] w-[40px]" />
          <Text className="font-semibold text-lg text-baseGreen">My Favorites</Text>
          <TouchableOpacity
            className="bg-lightGreen p-2.5 rounded-full"
            onPress={ () => navigation.navigate("userNotificationsScreen") }
          >
            <Notification color="#133522" size={24} variant="Bold" />
            <NotificationBadgeComponent />
          </TouchableOpacity>
        </View>

        {/*==== Search Box ====*/}
        <View className="h-auto w-full mt-3 px-5 flex-row items-center justify-center">
          <View className="h-auto w-full px-3 py-1 flex-1 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
            <SearchNormal1 color="#9ca3af" />
            <TextInput
              placeholder="Search item"
              placeholderTextColor="#9ca3af"
              className="h-[44px] flex-1 ml-2 text-base"
              value={searchPhrase}
              onChangeText={setSearchPhrase}
              returnKeyType="search"
            />
            { !!searchPhrase && (
              <TouchableOpacity
                onPress={ () => setSearchPhrase("") }
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <CloseCircle color="#9ca3af" size={20} variant="Bold" />
              </TouchableOpacity>
            ) }
          </View>
        </View>
        <View className="h-5" />

        <FlatList
          className="h-auto w-full"
          data={visibleProducts}
          renderItem={({ item }) => (
            <View style={{ flex: 1, maxWidth: "48.5%" }}>
              <SavedProductCard product={item} />
            </View>
          )}
          keyExtractor={(item, index) => item?.productId ?? `${index}`}
          numColumns={2}
          columnWrapperStyle={{
            gap: 10,
            marginBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
          refreshing={isWishlistFetching}
          onRefresh={refetch}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={
            isWishlistLoading
              ? <Text className="mt-10 text-center font-montserratMedium text-gray-400">Loading your favorites…</Text>
              : searchPhrase
                ? <EmptyListComponent standalone message={ `No saved item matches "${ searchPhrase }".` } />
                : (
                  <View className="h-auto w-full mt-1 px-6 py-10 bg-gray-50">
                    <FastImage
                      source={ require("../../../../../assets/images/empty_box.png") }
                      resizeMode={ FastImage.resizeMode.contain }
                      className="h-[70px] w-full"
                    />
                    <Text className="mt-4 text-center font-montserratMedium text-base text-gray-500">Your wish list is empty</Text>

                    { isGuest && (
                      <>
                        <Text className="mt-3 text-center text-sm text-gray-500">
                          Have an account? Sign in to share your wish list and sync across all your devices..
                        </Text>
                        <Text className="mt-3 text-center text-sm text-[#E0A42C]">
                          Note that we can only save your wish list for 30 days if you are not signed in.
                        </Text>
                        <TouchableOpacity
                          onPress={ () => {
                            dispatch(clearPendingDestination());
                            navigation.navigate("loginScreen");
                          } }
                          className="mt-5 self-center px-4 py-2"
                        >
                          <Text className="font-montserratSemiBold text-base text-baseGreen">Sign In</Text>
                        </TouchableOpacity>
                      </>
                    ) }
                  </View>
                )
          }
        />

      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default AuthCheck(SavedScreen);