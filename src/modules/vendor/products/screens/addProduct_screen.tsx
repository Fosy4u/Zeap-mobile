import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {View, Text, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Image, Dimensions} from 'react-native';
import AppHeaderComp from "../../general/components/appHeader_comp.tsx";
import {ArrowRight, Trash} from "iconsax-react-native";
import DeleteDraftWarningPopupModal from "../modals/deleteDraftWarningPopup_modal.tsx";
import useAddBespokeClothesHook from '../hooks/bespokeClothes/addBespokeClothes_hook.ts';
import SkeletonBlock from '../../../general/components/skeletonBlock_component';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model.ts';
import { RootState } from '../../../../redux/store/store.ts';
import { setProduct, setProductMode, setProductType, setSelectedStep } from '../slices/vendorProductState_slice.ts';
import IVendorProductDetails from '../models/vendorProductDetails_model.ts';
import AppStatusBar from "../../../general/components/appStatusBar";

const PRODUCT_CATEGORIES: { title: string; note?: string; icon: any; productType: string; screen: "addBespokeClothesScreen" | "addReadyMadeClothesScreen" | "addBespokeShoesScreen" | "addReadyMadeShoesScreen" | "addAccessoriesScreen" }[] = [
    { title: "Bespoke Clothes", note: "Seller must be a tailor", icon: require("../../../../../assets/images/clothe.png"), productType: "Clothes", screen: "addBespokeClothesScreen" },
    { title: "Ready-To-Wear Clothes", icon: require("../../../../../assets/images/clothe.png"), productType: "Clothes", screen: "addReadyMadeClothesScreen" },
    { title: "Bespoke Footwears", note: "Seller must be a shoemaker", icon: require("../../../../../assets/images/shoe.png"), productType: "Footwear", screen: "addBespokeShoesScreen" },
    { title: "Ready-To-Wear Footwears", icon: require("../../../../../assets/images/shoe.png"), productType: "Footwear", screen: "addReadyMadeShoesScreen" },
    { title: "Accessories", icon: require("../../../../../assets/images/watch.png"), productType: "Accessories", screen: "addAccessoriesScreen" },
];

const AddProductScreen = () => {
    const { draftProducts } = useSelector((state: RootState) => state.vendorProductState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        handleResetProductMode, handleGetDraftProducts, isLoadingDraftProducts,
        handleDeleteDraftProduct,
        showDeleteDraftModal, setShowDeleteDraftModal,
        draftToDeleteId, setDraftToDeleteId,
    } = useAddBespokeClothesHook();

    const draftToDelete = draftProducts?.find((draft) => draft.productId === draftToDeleteId);

    const handleSelectCategory = (category: typeof PRODUCT_CATEGORIES[number]) => {
        dispatch(setProductType(category.productType));
        dispatch(setProductMode("New"));
        dispatch(setProduct({}));
        dispatch(setSelectedStep(1));
        navigation.navigate(category.screen);
    };

    useEffect(() => {
        handleResetProductMode();
        handleGetDraftProducts();
    }, [])
    

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-white">
            <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

            {/*==== Header ====*/}
            <AppHeaderComp title="Add Product" />

            <ScrollView showsVerticalScrollIndicator={false} className="h-full w-full px-5 py-5">

                {/*==== Draft Section ====*/}
                <Text className="mt-2 font-montserratMedium text-lg text-gray-700">Products in draft</Text>
                <Text className="mt-1 font-montserratMedium text-sm">Continue with product in draft</Text>
                { !isLoadingDraftProducts ? (
                    draftProducts?.length !== 0 ? (
                        draftProducts?.map((product: IVendorProductDetails) => (
                            <TouchableOpacity key={ product._id } onPress={ () => null }
                                className="h-auto w-full mt-3 p-4 rounded-xl border border-gray-200 bg-lightGray">
                                <View className="flex-row items-center justify-between">
                                    <Text className="flex-1 font-montserratMedium text-lg text-gray-700">{ product.title }</Text>
                                    <TouchableOpacity
                                        onPress={ () => {
                                            setDraftToDeleteId(product.productId!);
                                            setShowDeleteDraftModal(true);
                                        } }
                                        className="ml-2 p-1.5"
                                    >
                                        <Trash size={ 20 } color="#dc2626" variant="Bold" />
                                    </TouchableOpacity>
                                </View>
                                <View className="mt-3 flex-row items-center justify-between">
                                    <Text className="mt-1 font-montserratMedium text-sm">{
                                        product.productType === "bespokeCloth" ? "Bespoke Clothes" :
                                        product.productType === "readyMadeCloth" ? "Ready to Wear Cloth" :
                                        product.productType === "bespokeShoe" ? "Bespoke Footwear" :
                                        product.productType === "readyMadeShoe" ? "Ready to Wear Footwear" :
                                        "Accessories"
                                    }</Text>

                                    <TouchableOpacity
                                        onPress={ () => {
                                            dispatch(setProduct(product));
                                            dispatch(setProductMode("Draft"));
                                            dispatch(setSelectedStep(Math.min(Math.max(product.currentStep ?? 1, 1), 6)));
                                            navigation.navigate(
                                                product.productType === "bespokeCloth" ? "addBespokeClothesScreen" :
                                                product.productType === "readyMadeCloth" ? "addReadyMadeClothesScreen" :
                                                product.productType === "bespokeShoe" ? "addBespokeShoesScreen" :
                                                product.productType === "readyMadeShoe" ? "addReadyMadeShoesScreen" :
                                                "addAccessoriesScreen"
                                            );
                                        } }
                                        className="h-[35px] w-auto px-2 flex flex-row items-center justify-center rounded-md bg-baseGreen"
                                    >
                                        <Text className="font-montserratMedium text-xs text-white mr-2">Continue</Text>
                                        <ArrowRight size={ 18 } className="text-white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="h-auto w-full mt-3 p-5 rounded-xl border border-gray-200 bg-lightGray">
                            <Text className="font-montserratMedium text-lg text-gray-700">No products in draft</Text>
                        </View>
                    )
                ) : (
                    <View className="mt-3 w-full">
                        <SkeletonBlock width={ Dimensions.get('window').width - 40 } height={ 100 } radius={ 10 } />
                    </View>
                ) }

                <Text className="my-5 font-montserratMedium text-gray-700">OR</Text>

                {/*==== Add a New Product ====*/}
                <Text className="font-montserratMedium text-lg text-gray-700">Add a new product</Text>
                <Text className="mt-1 font-montserratMedium text-sm">Select the product type you want to add</Text>

                <View className="h-auto w-full mt-5 flex-row flex-wrap justify-between" style={{ rowGap: 16 }}>
                    { PRODUCT_CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={ category.title }
                            onPress={ () => handleSelectCategory(category) }
                            className="h-auto px-4 py-5 rounded-xl border border-gray-100 bg-gray-50"
                            style={{ width: "48%" }}
                        >
                            <View className="w-[50px] h-[50px] flex-row items-center justify-center rounded-xl bg-gray-100">
                                <Image
                                    source={ category.icon }
                                    resizeMode="contain"
                                    className="h-[25px] w-auto rounded-2xl"
                                />
                            </View>
                            <Text className="mt-2 font-montserratMedium text-sm text-gray-700">{ category.title }</Text>
                            { category.note && (
                                <Text className="mt-1 font-montserratMedium text-[10px] text-red-600">{ category.note }</Text>
                            ) }
                        </TouchableOpacity>
                    )) }
                </View>


                {/*==== Proceed Button ====*/}
                <TouchableOpacity
                    onPress={ () => null }
                    className="h-[55px] w-auto my-10 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                    <Text className="font-montserratMedium text-lg text-white mr-2">Proceed</Text>
                    <ArrowRight className="text-white" />
                </TouchableOpacity>
            </ScrollView>

            { showDeleteDraftModal && (
                <DeleteDraftWarningPopupModal
                    productTitle={ draftToDelete?.title || "this product" }
                    onCancel={ () => setShowDeleteDraftModal(false) }
                    onConfirm={ () => handleDeleteDraftProduct(draftToDeleteId) }
                />
            ) }
        </SafeAreaView>
    );
};
export default AddProductScreen;
