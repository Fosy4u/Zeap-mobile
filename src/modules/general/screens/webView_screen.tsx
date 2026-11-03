import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { ArrowLeft, Refresh2 } from "iconsax-react-native";
import RootNavigationStackModel from "../../../routes/model/routes_model";

const WebViewScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const { params } = useRoute<RouteProp<RootNavigationStackModel, "webViewScreen">>();
    const webViewRef = useRef<WebView>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    const handleReload = () => {
        setHasError(false);
        setIsLoading(true);
        webViewRef.current?.reload();
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

            <SafeAreaView className="flex-1">
                {/*==== Top chrome ====*/}
                <View className="h-auto w-full px-5 py-3 flex-row items-center justify-between border-b border-gray-100">
                    <TouchableOpacity
                        onPress={ () => navigation.goBack() }
                        className="h-10 w-10 items-center justify-center rounded-full bg-baseGreen"
                    >
                        <ArrowLeft size={ 18 } color="#ffffff" />
                    </TouchableOpacity>

                    <Text numberOfLines={ 1 } className="flex-1 mx-3 font-montserratSemiBold text-base text-baseGreen text-center">
                        { params?.title ?? "Zeaper" }
                    </Text>

                    <TouchableOpacity
                        onPress={ handleReload }
                        className="h-10 w-10 items-center justify-center rounded-full bg-lightGreen"
                    >
                        <Refresh2 size={ 18 } color="#133522" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1">
                    { hasError ? (
                        <View className="flex-1 px-8 items-center justify-center">
                            <Text className="font-montserratSemiBold text-base text-gray-700 text-center">
                                We couldn't load this page
                            </Text>
                            <Text className="mt-2 font-montserratMedium text-sm text-gray-500 text-center leading-6">
                                Please check your internet connection and try again.
                            </Text>
                            <TouchableOpacity
                                onPress={ handleReload }
                                className="h-[48px] px-8 mt-5 items-center justify-center rounded-xl bg-baseGreen"
                            >
                                <Text className="font-montserratSemiBold text-sm text-white">Try again</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <WebView
                            ref={ webViewRef }
                            source={{ uri: params?.url ?? "" }}
                            startInLoadingState={ false }
                            onLoadStart={ () => setIsLoading(true) }
                            onLoadEnd={ () => setIsLoading(false) }
                            onError={ () => { setIsLoading(false); setHasError(true); } }
                            onHttpError={ () => setIsLoading(false) }
                            setSupportMultipleWindows={ false }
                            allowsBackForwardNavigationGestures
                            pullToRefreshEnabled
                        />
                    ) }

                    { isLoading && !hasError && (
                        <View className="absolute inset-0 items-center justify-center bg-white">
                            <ActivityIndicator size="large" color="#133522" />
                            <Text className="mt-3 font-montserratMedium text-xs text-gray-500">Loading...</Text>
                        </View>
                    ) }
                </View>
            </SafeAreaView>
        </View>
    );
};

export default WebViewScreen;
