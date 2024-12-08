import { useSelector } from 'react-redux';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowRight, Heart, Notification, Star1, Trash } from 'iconsax-react-native';
import { RootState } from '../../../../redux/store/store';


const CartScreen = () => {
  const { carts } = useSelector((state: RootState) => state.cartState);
  const { popularProducts } = useSelector((state: RootState) => state.productState);

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
            onPress={ () => null }
          >
            <Notification color="#133522" size={24} variant="Bold" />
          </TouchableOpacity>
        </View>

        {/*==== Cart List ====*/}
        <ScrollView showsVerticalScrollIndicator={ false }
          className="h-auto w-full">
          { (carts.length !== 0)
          ? (carts.map((cart) => (
            <View key={ cart.productId } className="h-auto w-full">
              <View key={ cart.productId }
                className="h-auto w-full py-[20px] flex-row items-center justify-start">
                <Image
                  className="h-[80px] w-[60px]"
                  resizeMode="center"
                  // source={ 
                  //   cart.colors[0]?.images[1]?.link
                  //   ? { uri: cart.colors[0]?.images[1]?.link }
                  //   : require("../../../../assets/app_logo.png")
                  // }
                  source={ cart.image }
                />
                <View className="h-auto flex-1 ml-4">
                  <Text className="text-base text-gray-800">{ cart.title }</Text>
                  <Text className="text-xs text-gray-500">Color: { cart.color }</Text>

                  <View className="h-auto flex-1 mt-2 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-x-4">
                      <TouchableOpacity onPress={ () => null } >
                        <Text className="text-2xl">&minus;</Text>
                      </TouchableOpacity>

                      <View className="h-[25px] w-[25px] flex-row justify-center items-center border border-gray-400 rounded-lg">
                        <Text className="">{ cart.count }</Text>
                      </View>
                      

                      <TouchableOpacity onPress={ () => null } >
                        <Text className="text-2xl">&#43;</Text>
                      </TouchableOpacity>
                    </View>

                    <Text className="font-semibold text-lg text-baseGreen">₦ { cart.price.toLocaleString() }</Text>

                    <TouchableOpacity onPress={ () => null } >
                      <Trash color="#AA1F1F" size={18} variant="Bold" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View className="h-[1px] w-full bg-gray-200" />
            </View>
          )))
          : (
            <View className="h-[300px] w-full flex-1 items-center justify-center">
              <Text className="text-lg">No item available</Text>
            </View>
          ) }


          {/*==== Subtotal ====*/}
          <View className="mt-5 flex-row justify-between items-center">
            <Text className="text-base text-baseGreen">Subtotal</Text>
            <Text className="font-semibold text-lg text-baseGreen">₦ { carts[0].price.toLocaleString() }</Text>
          </View>
          <Text className="text-xs text-gray-500">Delivery fees not included yet.</Text>

          <TouchableOpacity 
            onPress={() => null}
            className="h-[55px] w-auto mt-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed To Checkout</Text>
            <ArrowRight className="text-white" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => null}
            className="h-[55px] w-auto mt-4 flex flex-row items-center justify-center rounded-xl bg-gold"
          >
            <Text className="font-medium text-lg text-baseGreen mr-2">Continue Shopping</Text>
            <ArrowRight className="text-baseGreen" />
          </TouchableOpacity>

          {/*==== Similar Items Section ====*/}
          <View className="mt-10 mb-5">
          <Text className="font-medium text-base text-baseGreen">Similar items</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={ false }
              className="h-auto w-full mt-3"
            >
              { popularProducts.map((popularProduct) => (
                <TouchableOpacity key={ popularProduct.productId }
                  onPress={ () => null }
                  className="h-auto w-[170px] mr-4 p-3 rounded-2xl overflow-hidden bg-[#F8F9FE]"
                >
                  <View className="h-auto w-full relative py-1 rounded-xl bg-white">
                    <Image
                      className="h-[100px] w-full rounded-t-2xl"
                      resizeMode="contain"
                      source={ 
                        popularProduct.colors[0]?.images[1]?.link
                        ? { uri: popularProduct.colors[0]?.images[1]?.link }
                        : require("../../../../assets/app_logo.png")
                      }
                    />
                    <View className="h-[35px] w-[35px] absolute top-1 right-2 flex items-center justify-center rounded-xl bg-gray-200">
                      <Heart color="gray" />
                    </View>
                  </View>
                  <View className="mt-3">
                    <Text className="text-sm text-gray-800">{ popularProduct.title }</Text>
                    <View className="mt-1.5 flex-row items-center justify-between">
                      <Text className="px-2.5 py-1 text-xs rounded-lg bg-lightGreen">{ popularProduct.categories.productGroup.split("-").join(" ") }</Text>

                      <View className="flex-row">
                        <Star1 color="#E4A01C" size={18} variant="Bold" className="mr-0.5" />
                        <Text>4.3</Text>
                      </View>
                    </View>
                    <Text className="mt-2.5 text-base font-medium text-gray-900">₦{ popularProduct.variations[0].price.toLocaleString() }</Text>
                  </View>
                </TouchableOpacity>
              )) }
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default CartScreen;