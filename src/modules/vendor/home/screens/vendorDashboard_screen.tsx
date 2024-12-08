import React from "react"
import { Image, Pressable, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { Add, ArrowDown, ArrowRight, ArrowUp, Calendar, Edit2, Notification, Star1, Trash } from "iconsax-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { BarChart } from "react-native-gifted-charts";


const VendorDashboardScreen = () => {
  const { overviews, weeklySalesChartData, recentPayments } = useSelector((state: RootState) => state.vendorHomeState);
  const { userData } = useSelector((state: RootState) => state.profileState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  // console.log("USER DATA::: ", userData);
  
  return (
    <SafeAreaView className="flex-1 h-auto w-screen pb-24 bg-gray-50">
      <StatusBar
          backgroundColor="#133522"
          barStyle="light-content"
      />

      {/* ==== Hero Section ==== */}
      <View className="h-[260px] w-full px-5 pt-2 rounded-b-3xl bg-baseGreen">
        <View className="flex-row items-center justify-between">
          <Image
            className="h-[60px] w-[60px] rounded-xl"
            resizeMode="cover"
            source={require("../../../../assets/app_logo.png")}
          />
          <Pressable
            className="bg-[#20704329] p-2.5 rounded-xl"
            onPress={ () => navigation.navigate("notificationsScreen") }
          >
            <Notification color="#D5B07B" size={24} variant="Bold" />
          </Pressable>
        </View>


        <View className="mt-1">
          <Text className="text-gray-300 text-sm">{ "Zona Fashion Store" }</Text>
          <Text className="mt-1  text-white">{ (userData.firstName) ? `Hello, ${userData.firstName} ${userData.lastName} ✌🏽` : "User" }</Text>
          <Text className="text-gray-400 text-xs">Let’s sell something today</Text>
        </View>

        <View className="mt-5 px-5 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-xs">Total revenue</Text>
            <Text className="text-gray-400 text-xl">{ `₦540,600`}</Text>
            <Text className="mt-2 text-gray-400 text-xs">{ `Last month’s revenue = ₦412,058`}</Text>
          </View>

          <View className="flex-row items-center">
            <ArrowUp  color="#9ca3af" size={12} className="mr-1" />
            <Text className="text-gray-400 text-xs">{ `10%`}</Text>
          </View>
        </View>
      </View>

      <ScrollView>
        <View className="px-5">

          {/* ==== Add Product ==== */}
          <TouchableOpacity 
            onPress={ () => null }
            className="h-[55px] w-full mt-5 flex flex-row items-center justify-center rounded-xl bg-lightGreen"
          >
            <Add className="text-baseGreen" />
            <View className="w-[5px]" />
            <Text className="font-normal text-base text-baseGreen">Add Product</Text>
          </TouchableOpacity>

          {/* ==== Overview Section ==== */}
          <View className="mt-4">
            <View className="flex-row justify-between items-center">
              <Text className="font-normal text-base text-baseGreen">Overview</Text>
              <TouchableOpacity onPress={ () => navigation.navigate("allCategoryScreen") }>
                <Text className="text-sm text-baseGreen">View all</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full mt-2 flex-row items-center justify-between">
              { overviews.map((overview) => (
                <View
                  key={ overview.name } 
                  className="w-[48%] px-4 py-2.5 border border-gray-200 rounded-xl bg-lightGray"
                >
                  <Text className="font-medium text-lg">{ overview.count }</Text>
                  <Text className="text-sm">{ overview.name }</Text>
                </View>
              )) }
            </View>
          </View>
          
          {/* ==== Wekly Sales Chart ==== */}
          <View className="h-auto w-full mt-5 px-2.5 py-3.5 border border-gray-200 rounded-xl bg-lightGray">
            <View className="flex-row items-center justify-between">
              <Text className="font-normal text-base text-baseGreen">Weekly Sales</Text>
              <View className="px-2 py-1.5 flex-row items-center border border-gray-200 rounded-lg bg-gray-50">
                <Text className="mr-2 text-xs text-gray-600">12-18, Aug</Text>
                <Calendar color="#6b7280" size={ 14 } />
              </View>
            </View>

            <View className="h-auto w-full mt-2 overflow-hidden">
              <BarChart
                data={ weeklySalesChartData }
                barWidth={ 20 }
                cappedBars
                capColor={ "rgb(17, 47, 30)" }
                capRadius={ 2 }
                capThickness={ 4 }
                showGradient
                gradientColor={ "rgba(17, 47, 30, 0.7)" }
                frontColor={ "rgba(17, 47, 30, 0.1)" }
                yAxisTextStyle={{ color: "#6b7280", fontSize: 12 }}
                xAxisLabelTextStyle={{ color: "#6b7280", fontSize: 12 }}
                yAxisLabelSuffix="K"
              />
            </View>
          </View>

          {/* ==== Recent Payment ==== */}
          <View className="h-auto w-full mt-5 p-3 border border-gray-200 rounded-xl bg-lightGray">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-normal text-base text-baseGreen">Recent Payment</Text>   
              <TouchableOpacity onPress={ () => navigation.navigate("allCategoryScreen") }>
                <Text className="text-sm text-baseGreen">View all</Text>
              </TouchableOpacity>
            </View>

            { recentPayments.map((recentPayment) => (
              <View key={ recentPayment.id } className="my-3 flex-row items-center">
                <View className={`h-9 w-9 mr-3 ${ recentPayment.status == "Success" ? "bg-lightGreen/70" : "bg-orange/10" } flex items-center justify-center rounded-full`}>
                  { (recentPayment.status === "Success")
                    ? <ArrowDown color="green" size={ 20 } className="rotate-[30deg]" />
                    : <Text className="text-2xl text-orange">!</Text>
                  }
                </View>
                <View>
                  <Text className="text-base">₦{ recentPayment.amount }</Text>
                  <Text className="text-xs">{ recentPayment.productName }  -  { recentPayment.date }</Text>
                </View>
              </View>
            )) }
          </View>

          {/* ==== Product List ==== */}
          <View className="h-auto w-full mt-5 mb-4 p-3 pb-4 border border-gray-200 rounded-xl bg-lightGray">
            <View className="flex-row items-center justify-between">
              <Text className="font-normal text-base text-baseGreen">Product List</Text>
              <TouchableOpacity 
                onPress={ () => null }
                className="px-3 py-2 flex flex-row items-center justify-center rounded-lg bg-gold"
              >
                <Text className="text-sm text-baseGreen mr-2">View All</Text>
                <ArrowRight size={ 18 } className="text-baseGreen" /> 
              </TouchableOpacity>
            </View>

            <View className="relative mt-2 flex items-center justify-center">

              <Image
                source={ require("../../../../assets/home/sweat_shirt.png") }
                resizeMode="contain"
                className="h-[250px] w-full"
              />

              <View className="absolute top-5 left-4 right-4 flex-row justify-between">
                <View className="w-[110px] px-2 py-1 rounded-lg border border-white/60 backdrop-blur-lg bg-white/50">
                  <View className="flex-row items-center">
                    <Star1 color="#E4A01C" size={14} variant="Bold" className="mr-1" />
                    <Text className="text-xs">4.3</Text>
                  </View>
                  <Text className="text-[11px]">200 reviews</Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <View className="p-2 flex items-center justify-center rounded-lg border border-orange/30 backdrop-blur-lg bg-orange/20">
                    <Text className="text-xs text-orange/90">Pending Review</Text>
                  </View>
                </View>
              </View>

              <View className="absolute bottom-24 right-4 p-2 flex items-center justify-center rounded-lg border border-gray-200/70 backdrop-blur-lg bg-white/40">
                <Edit2 color="#3461B9" size={18} variant="Bold" className="mr-1" />
              </View>

              <View className="h-auto w-full mt-4 flex-row items-center">
                <View className="mr-1.5 px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                  <Text className="text-xs text-[#3461B9] ">Men's wear</Text>
                </View>
                <View className="px-2 py-1 flex-row items-center border border-[#9EBDF8] rounded-md bg-[#E3ECFF]">
                  <Text className="text-xs text-[#3461B9] ">Adult</Text>
                </View>
              </View>

              <View>
                <View className="h-auto w-full mt-1 flex-row items-center justify-between">
                  <Text className="text-base">Men's Vintage Shirt</Text>
                  <Text className="text-xs text-green-600">20 in stock</Text>
                </View>
                <Text className="font-medium text-base">{ `₦5400.90`}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default VendorDashboardScreen;