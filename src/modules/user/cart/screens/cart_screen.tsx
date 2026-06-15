import { useDispatch, useSelector } from 'react-redux';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView, ToastAndroid, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowRight, Notification, Trash } from 'iconsax-react-native';
import { RootState } from '../../../../redux/store/store';
import AppLoader from '../../../general/components/appLoader';
import useCartHook from '../hooks/cart_hook';
import useAddressHook from '../../address/hooks/address_hook';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { setProductID } from '../../products/slices/product_slice';
import useGeneralHook from '../../../general/hooks/general_hook';
import formatCurrency from '../../../../utils/formatCurrency';
import ProductCardComponent from '../../../general/components/productCard_component.tsx';
import EmptyListComponent from '../../../general/components/emptyList_component';
import CartSkeletonLoader from '../components/cartSkeletonLoader_component.tsx';


const CartScreen = () => {
  const { cart } = useSelector((state: RootState) => state.cartState);
  const { popularProducts } = useSelector((state: RootState) => state.productState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  // Track whether the initial cart fetch has settled at least once. Until it has,
  // we suppress the empty-cart UI so the user never sees a flash of "empty" before
  // their real cart loads.
  const [hasInitialCartFetched, setHasInitialCartFetched] = useState(false);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  // Local flag that drives the loader the instant "Checkout Now" is tapped, so the
  // user gets immediate feedback instead of waiting through the checkout screen's
  // (synchronous) mount cost. Reset on every focus return.
  const [isOpeningCheckout, setIsOpeningCheckout] = useState(false);
  // The basketItem._id currently being removed — drives a per-item spinner on
  // its bin button so the delete gives immediate feedback.
  const [removingId, setRemovingId] = useState<string | null>(null);
  // The basketItem._id + direction of an in-flight quantity change — drives a
  // spinner on the tapped +/- button and disables both for that row.
  const [qtyBusy, setQtyBusy] = useState<{ id: string; type: "inc" | "dec" } | null>(null);

  const {
    handleGetCarts,
    handleIncreamentProductQuantity,
    handleDecreamentProductQuantity,
    handleRemoveProductFromCart,
    handleGetDeliveryDate,
    handleGetDeliveryMethod,
    handleGetOderSummary,
    getItemDeliveryPeriod,
  } = useCartHook();
  const { handleGetDeliveryAddresses } = useAddressHook();
  const { getColorCode } = useGeneralHook();

  // Fire all data fetches in parallel on focus. Cart items drive the loader;
  // the rest run silently in the background so the cart UI is unblocked the
  // moment cart items arrive.
  const fetchAllCartData = useCallback(async () => {
    const cartItemsFetch = handleGetCarts().finally(() => setHasInitialCartFetched(true));
    handleGetDeliveryDate();
    handleGetDeliveryMethod();
    handleGetOderSummary();
    handleGetDeliveryAddresses();
    await cartItemsFetch;
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Clear the opening-checkout flag when we return to cart (e.g. user pressed
      // back from checkout). Without this, the loader would still be on screen.
      setIsOpeningCheckout(false);
      fetchAllCartData();
    }, [])
  );

  // Show the loader instantly on tap, then yield one animation frame so React
  // paints the loader *before* the JS thread gets blocked mounting CheckoutScreen
  // (which sets up two heavy hooks: useAddressHook + useEditAccountDetailsHook).
  const handleOpenCheckout = useCallback(() => {
    setIsOpeningCheckout(true);
    requestAnimationFrame(() => {
      navigation.navigate("checkoutScreen");
    });
  }, [navigation]);

  const onPullToRefresh = useCallback(async () => {
    setIsPullRefreshing(true);
    try {
      await fetchAllCartData();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [fetchAllCartData]);

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
          <Text className="font-semibold text-lg text-baseGreen">My Cart</Text>
          <TouchableOpacity
            className="bg-lightGreen p-2.5 rounded-full"
            onPress={ () => navigation.navigate("userNotificationsScreen") }
          >
            <Notification color="#133522" size={24} variant="Bold" />
          </TouchableOpacity>
        </View>

        {/*==== Cart List ====*/}
        <ScrollView
          showsVerticalScrollIndicator={ false }
          className="h-auto w-full"
          refreshControl={
            <RefreshControl
              refreshing={ isPullRefreshing }
              onRefresh={ onPullToRefresh }
              colors={ ["#133522"] }
              tintColor="#133522"
            />
          }
        >
          { (!hasInitialCartFetched && (!cart?.basketItems || cart.basketItems.length === 0))
          ? (
            // Initial fetch hasn't settled — show the skeleton instead of flashing
            // "no items" before the user's real cart loads.
            <CartSkeletonLoader />
          )
          : (cart?.basketItems && cart.basketItems.length > 0)
          ? (
            <View>
              { cart?.basketItems?.map((basketItem) => {
                return (
                  <View key={ basketItem._id! } className="h-auto w-full">
                    <View
                      className="h-auto w-full pt-[20px] pb-1 flex-row items-center justify-start">
                      <Image
                        className="h-[120px] w-[80px]"
                        resizeMode="center"
                        source={
                          basketItem?.image!
                          ? { uri: basketItem?.image! }
                          : require("../../../../../assets/images/app_logo_green.png")
                        }
                      />
                      <View className="h-auto flex-1 ml-3">
                        <Text className="text-sm text-gray-800">{ basketItem.title! }</Text>
                        <View className="h-auto flex-row mt-1 items-center justify-start space-x-5">
                          <View className="h-auto flex-row mt-1 items-center justify-start">
                            <Text className="mr-1 text-xs text-gray-500"> Color:</Text>
                            <View className="h-3 w-3 mr-0.5 rounded-full" style={ { backgroundColor: getColorCode(basketItem.color!) } } />
                            <Text className="font-semibold text-xs text-gray-600">{ basketItem.color! }</Text>
                          </View>

                          <View className="h-4 w-[1px] bg-gray-600" />

                          <View className="h-auto flex-row mt-1 items-center justify-start">
                            <Text className="mr-1 text-xs text-gray-500">Size: </Text>
                            <Text className="font-semibold text-xs text-gray-600">{ basketItem.size! }</Text>
                          </View>
                        </View>

                        <View className="h-auto flex-1 mt-2 flex-row items-center justify-between">
                          <View className="flex-row items-center gap-x-4">
                            <TouchableOpacity
                             className={ `h-[30px] w-[30px] p-0 justify-center items-center border border-gray-400 rounded-lg ${ qtyBusy?.id === basketItem._id && qtyBusy?.type === "dec" ? "" : "pb-2" }` }
                              disabled={ qtyBusy?.id === basketItem._id }
                              onPress={ async () => {
                                // If the quantity is 1, show a toast message
                                if (basketItem?.quantity === 1) {
                                    ToastAndroid.show("You cannot decrement the quantity below 1", ToastAndroid.SHORT);
                                    return;
                                }
                                setQtyBusy({ id: basketItem._id!, type: "dec" });
                                try {
                                  await handleDecreamentProductQuantity(basketItem._id!);
                                } finally {
                                  setQtyBusy(null);
                                }
                              }}
                            >
                              { qtyBusy?.id === basketItem._id && qtyBusy?.type === "dec"
                                ? <ActivityIndicator size="small" color="#133522" />
                                : <Text className="text-2xl leading-7">&minus;</Text> }
                            </TouchableOpacity>

                            <Text className="font-montserratMedium text-lg">{ basketItem.quantity! }</Text>

                            <TouchableOpacity
                              className="h-[30px] w-[30px] justify-center items-center border border-gray-400 rounded-lg"
                              disabled={ qtyBusy?.id === basketItem._id }
                              onPress={ async () => {
                                setQtyBusy({ id: basketItem._id!, type: "inc" });
                                try {
                                  await handleIncreamentProductQuantity(basketItem._id!);
                                } finally {
                                  setQtyBusy(null);
                                }
                              } }
                            >
                              { qtyBusy?.id === basketItem._id && qtyBusy?.type === "inc"
                                ? <ActivityIndicator size="small" color="#133522" />
                                : <Text className="text-xl leading-6">&#43;</Text> }
                            </TouchableOpacity>
                          </View>

                          <Text className="font-semibold text-lg text-baseGreen">{ formatCurrency(basketItem.actualAmount!, basketItem.currency!) }</Text>

                          <TouchableOpacity
                            disabled={ removingId === basketItem._id }
                            onPress={ async () => {
                              setRemovingId(basketItem._id!);
                              try {
                                await handleRemoveProductFromCart(basketItem._id!);
                              } finally {
                                setRemovingId(null);
                              }
                            } }
                          >
                            { removingId === basketItem._id
                              ? <ActivityIndicator size="small" color="#AA1F1F" />
                              : <Trash color="#AA1F1F" size={18} variant="Bold" /> }
                          </TouchableOpacity>
                        </View>

                        { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Standard") && (
                          <Text className="font-montserratMedium text-[10px] text-blue-400">Delivery period: { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Standard") } working days</Text>
                        ) }
                        { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Express") && (
                          <Text className="font-montserratMedium text-[10px] text-blue-400">Delivery period: { getItemDeliveryPeriod(cart.basketItems?.[0].sku!, "Express") } working days</Text>
                        ) }
                      </View>
                    </View>

                    <View className="h-[1px] w-full mt-2 bg-gray-200" />
                  </View>
                )
              }) }

              {/*==== Subtotal ====*/}
              <View className="mt-5 flex-row justify-between items-center">
                <Text className="text-base text-baseGreen">Subtotal</Text>
                <Text className="font-semibold text-lg text-baseGreen">{ formatCurrency(cart?.subTotal!, cart?.currency!) }</Text>
              </View>
              <Text className="text-xs text-gray-500">Delivery fees not included yet.</Text>
            </View>
          )
          : (
            <EmptyListComponent />
          ) }

          { (cart?.basketItems && cart.basketItems.length > 0) && (
            <TouchableOpacity
              onPress={ handleOpenCheckout }
              disabled={ isOpeningCheckout }
              className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
              <Text className="text-lg text-white mr-2">{ isOpeningCheckout ? "Opening checkout..." : "Checkout Now" }</Text>
              { isOpeningCheckout ? null : <ArrowRight className="text-white" /> }
            </TouchableOpacity>
          ) }

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("productListScreen", { screenTitle: "All Products" });
            }}
            className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-gold"
          >
            <Text className="font-medium text-lg text-baseGreen mr-2">{ (cart?.basketItems && cart.basketItems.length > 0) ? "Continue Shopping" : "Start Shopping" }</Text>
            <ArrowRight className="text-baseGreen" />
          </TouchableOpacity>

          {/*==== Similar Items Section ====*/}
          { popularProducts.length > 0 && (
            <View className="mt-10 mb-10">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-base text-baseGreen">Similar items</Text>
                <TouchableOpacity onPress={ () => navigation.navigate("productListScreen", { screenTitle: "Similar Products" }) }>
                  <Text className="text-sm text-baseGreen">See all</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={ false }
                className="h-auto w-full my-3"
              >
                { popularProducts.map((popularProduct) => (
                  <ProductCardComponent
                    key={ popularProduct.productId }
                    product={ popularProduct }
                    handleOnPress={ () => {
                      dispatch(setProductID(popularProduct.productId));
                      navigation.navigate("productDetailScreen");
                    } }
                    orientation="Vertical"
                  />
                )) }
              </ScrollView>
            </View>
          ) }

        </ScrollView>
      </SafeAreaView>

      { isOpeningCheckout && (
        <AppLoader loadingAdditionalMessage="Opening checkout..." />
      ) }
    </GestureHandlerRootView>
  )
}

export default CartScreen;
