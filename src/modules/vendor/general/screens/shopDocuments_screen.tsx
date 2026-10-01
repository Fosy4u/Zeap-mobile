import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArrowLeft, ArrowRight2, CloseCircle, DocumentText1, Gallery } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useGetOnboardingDocumentsQuery, IOnboardingDocumentRequirement } from '../apis/general_api';
import AuthCheck from '../../../auths/components/authCheck';
import useShopGuardHook from '../hooks/shopGuard_hook';
import NoShopPopupModal from '../modals/noShopPopup_modal';

const ShopDocumentsScreen = () => {
    const { shop, isCheckingShop, hasNoShop, recheckShop } = useShopGuardHook();
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    /* shop.shopId comes from /shop/auth; fall back to userData.shopId in case
       the shop hasn't hydrated yet. */
    const shopId = shop?.shopId || userData?.shopId || "";

    const { data: documents = [], isFetching, isError } = useGetOnboardingDocumentsQuery(shopId, { skip: !shopId });

    // The document whose image is currently previewed in the modal.
    const [previewDoc, setPreviewDoc] = useState<IOnboardingDocumentRequirement | null>(null);

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="h-full w-full flex-1">

                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />

                {/*==== Header ====*/}
                <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
                    <TouchableOpacity onPress={ () => navigation.pop() }>
                        <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
                            <ArrowLeft color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="font-semibold text-lg text-baseGreen">Identity & Shop Document</Text>
                    <View className="h-[40px] w-[40px]" />
                </View>

                {/* No shop, so no documents — "none uploaded yet" would
                    misdescribe why the list is empty. */}
                { hasNoShop && (
                    <NoShopPopupModal onRetry={ recheckShop } isRetrying={ isCheckingShop } />
                ) }

                { !hasNoShop && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
                >
                    <View className="h-auto w-full mt-7 px-3 py-5 border border-gray-200 bg-[#F8F9FE] rounded-lg">
                        <Text className="font-medium text-lg text-baseGreen">Identity & Shop Document</Text>
                        <Text className="mt-1 text-xs text-gray-500">Tap a document to view the uploaded file.</Text>

                        { isFetching ? (
                            <View className="mt-8 items-center">
                                <ActivityIndicator color="#133522" />
                                <Text className="mt-2 text-xs text-gray-500">Loading documents…</Text>
                            </View>
                        ) : isError || documents.length === 0 ? (
                            <View className="mt-8 items-center">
                                <Text className="text-center text-sm text-gray-600">
                                    No documents have been uploaded yet.
                                </Text>
                            </View>
                        ) : (
                            documents.map((doc, idx) => {
                                const hasFile = !!doc.link;
                                return (
                                    <TouchableOpacity
                                        key={ doc.slug }
                                        disabled={ !hasFile }
                                        onPress={ () => setPreviewDoc(doc) }
                                        activeOpacity={ 0.7 }
                                        className={ `h-auto w-full ${ idx === 0 ? "mt-6" : "mt-3" } px-3 py-4 flex-row items-center justify-between border border-gray-200 bg-white rounded-xl ${ hasFile ? "" : "opacity-50" }` }
                                    >
                                        <View className="flex-1 flex-row items-center gap-x-3">
                                            <View className="h-[44px] w-[44px] flex items-center justify-center rounded-xl bg-lightGreen">
                                                <DocumentText1 color="#133522" size={ 22 } variant="Bold" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-sm text-gray-700">{ doc.label }</Text>
                                                <Text className="mt-0.5 text-xs text-gray-400">
                                                    { hasFile ? "Tap to view" : "Not uploaded" }
                                                </Text>
                                            </View>
                                        </View>
                                        { hasFile && <ArrowRight2 size={ 20 } className="text-gray-500" /> }
                                    </TouchableOpacity>
                                );
                            })
                        ) }
                    </View>
                </ScrollView>
                ) }

                {/*==== Document preview modal ====*/}
                <Modal
                    visible={ !!previewDoc }
                    transparent
                    animationType="fade"
                    onRequestClose={ () => setPreviewDoc(null) }
                >
                    <View className="flex-1 bg-black/90 items-center justify-center px-5">
                        {/*==== Close ====*/}
                        <TouchableOpacity
                            onPress={ () => setPreviewDoc(null) }
                            className="absolute top-14 right-5 z-10"
                        >
                            <CloseCircle color="#FFFFFF" size={ 34 } variant="Bold" />
                        </TouchableOpacity>

                        <Text className="mb-4 font-medium text-base text-white text-center">
                            { previewDoc?.label }
                        </Text>

                        { previewDoc?.link && /\.pdf(\?|$)/i.test(previewDoc.link) ? (
                            /* PDFs can't render in FastImage — show a document tile
                               with a button to open the file in the device viewer. */
                            <View className="items-center">
                                <DocumentText1 color="#FFFFFF" size={ 56 } variant="Bold" />
                                <Text className="mt-3 text-sm text-gray-300">PDF document</Text>
                                <TouchableOpacity
                                    onPress={ () => {
                                        const link = previewDoc?.link;
                                        if (!link) { return; }
                                        Linking.openURL(link).catch(() =>
                                            Alert.alert("Couldn't open file", "No app available to open this PDF."),
                                        );
                                    } }
                                    className="mt-5 px-6 py-3 rounded-xl bg-baseGreen"
                                >
                                    <Text className="font-medium text-sm text-white">Open PDF</Text>
                                </TouchableOpacity>
                            </View>
                        ) : previewDoc?.link ? (
                            <FastImage
                                source={{ uri: previewDoc.link, priority: FastImage.priority.normal }}
                                resizeMode={ FastImage.resizeMode.contain }
                                className="h-[70%] w-full rounded-xl"
                            />
                        ) : (
                            <View className="items-center">
                                <Gallery color="#9ca3af" size={ 40 } />
                                <Text className="mt-2 text-sm text-gray-300">No preview available</Text>
                            </View>
                        ) }
                    </View>
                </Modal>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default AuthCheck(ShopDocumentsScreen);
