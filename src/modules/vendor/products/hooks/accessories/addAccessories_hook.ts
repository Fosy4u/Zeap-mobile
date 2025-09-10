import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../../routes/model/routes_model";
import { setDraftProducts, setProduct, setProductMode, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useLazyGetDraftProductsQuery } from "../../apis/accessoryProduct_api";

const useAddAccessoriesHook = () => {
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    
    const [getDraftProducts, { isLoading: isLoadingDraftProducts }] = useLazyGetDraftProductsQuery();
    

    // Handle reset product mode
    const handleResetProductMode = () => {
        dispatch(setProductMode("New"));
        dispatch(setSelectedStep(1));
        dispatch(setProduct({}));
    };

    // Get Draft Product
    const handleGetDraftProducts = async () => {
        try {
            const getDraftProductResponseData = await getDraftProducts({ shopId: userData?.shopId || "" }).unwrap();

            dispatch(setDraftProducts(getDraftProductResponseData));
            // console.log("GET DRAFT PRODUCT RESPONSE DATA::: ", getDraftProductResponseData);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    // Handle the Continue Saved Draft Product
    const handleContinueSavedDraftProduct = async () => {
        if (product?.currentStep) {
            dispatch(setSelectedStep(product?.currentStep + 1));
            navigation.navigate("addBespokeClothesScreen");
        }
    };


    // Handle get the text color
    const handleGetTextColor = (hex: string) =>
        (
            parseInt(hex.slice(1, 3), 16) * 0.299 +
            parseInt(hex.slice(3, 5), 16) * 0.587 +
            parseInt(hex.slice(5, 7), 16) * 0.114
        ) > 200 ? "text-black" : "text-white";


    return {
        handleGetDraftProducts, isLoadingDraftProducts,
        handleResetProductMode,
        handleContinueSavedDraftProduct,
        showWarningModal, setShowWarningModal,
        showSuccessModal, setShowSuccessModal,
        handleGetTextColor,
    };
};

export default useAddAccessoriesHook;