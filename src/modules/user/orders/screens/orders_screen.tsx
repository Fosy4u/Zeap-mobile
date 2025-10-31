import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, RefreshControl, SafeAreaView, StatusBar, TouchableOpacity, Animated, TextInput, Image } from 'react-native';
import AppLoader from '../../../general/components/appLoader';
import AuthCheck from '../../../auths/components/authCheck';
import { ArrowLeft, SearchNormal1 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import OrderFilterBottomSheetComponent from '../components/orderFilterBottomSheet_component';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OrderCardComponent from '../components/orderCard_component';
import { useSelector } from 'react-redux';
import useOrderHook from '../hooks/order_hook';
import { RootState } from '../../../../redux/store/store';
import LinearGradient from 'react-native-linear-gradient';
import EmptyListComponent from '../../../general/components/emptyList_component';

const OrdersScreen: React.FC = () => {   
    const { filteredOrders, isLoading, loadingMessage } = useSelector((state: RootState) => state.orderState);    
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const { handleGetOrders } = useOrderHook();

    // const [isFocused, setIsFocused] = useState(false);
    const iconTranslateX = useRef(new Animated.Value(0)).current;
    const inputTranslateX = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        // setIsFocused(true);
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
        // setIsFocused(false);
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

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['60%', '70%'], []);

    const setShowBottomSheetModal = useCallback((value: boolean) => {
        if (value) {
          bottomSheetModalRef.current?.present();
        } else {
          bottomSheetModalRef.current?.close();
        }
    }, []);


    useEffect(() => {
        handleGetOrders();
    }, []);


    if (isLoading) {
        return <AppLoader loadingAdditionalMessage={ loadingMessage } />;
    }

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <SafeAreaView className="h-auto w-full flex-1 pb-2 pt-2 bg-lightGray">
                    <StatusBar
                        backgroundColor="#133522"
                        barStyle="light-content"
                    />

                    {/* ==== Header ==== */}
                    <View className="h-auto w-full pt-5 px-5">
                        <View className="h-auto w-full flex-row items-center justify-between">
                            <TouchableOpacity
                                onPress={ () => navigation.navigate("homeScreen", { screen: "Profile"}) }
                                className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen"
                            >
                                <ArrowLeft color="white" size={24} />
                            </TouchableOpacity>
        
                            <Text className="font-montserratSemiBold text-xl text-baseGreen">My Orders</Text>
        
                            <View className="h-[40px] w-[40px]" />
                        </View>
                        
                        <LinearGradient
                            colors={[
                                "rgba(229, 231, 235, 0)",
                                "#e5e7eb",
                                "#9ca3af",
                                "#e5e7eb",
                                "rgba(229, 231, 235, 0)"
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="h-[1px] w-full mt-3 rounded"
                        />
                    </View>

                    {/*==== Search Box ====*/}
                    <View className="h-auto w-full mt-5 px-5 flex-row items-center justify-center">
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
                    
                    { (filteredOrders && filteredOrders.length > 0) ? (
                        <FlatList
                            data={filteredOrders}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View className="px-5">
                                    <OrderCardComponent order={item} />
                                </View>
                            )}
                            ListEmptyComponent={() => (
                            <View className="px-5 flex-1 items-center py-8">
                                <EmptyListComponent message="ordered products yet." />
                            </View>
                            )}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isLoading}
                                    onRefresh={handleGetOrders}
                                />
                            }
                        />
                    ) : (
                        <View className="px-5 flex-1 items-center py-8">
                            <EmptyListComponent message="orderered products yet." />
                        </View>
                    ) }

                    <OrderFilterBottomSheetComponent
                        bottomSheetModalRef={bottomSheetModalRef}
                        snapPoints={snapPoints}
                        setShowBottomSheetModal={setShowBottomSheetModal}
                    />
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
};

export default AuthCheck(OrdersScreen); 