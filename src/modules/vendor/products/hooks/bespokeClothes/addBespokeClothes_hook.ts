import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useLazyGetDraftProductsQuery } from "../../apis/bespokeProduct_api";
import { useDeleteDraftProductMutation } from "../../apis/product_api";
import { setDraftProducts, setProduct, setProductMode, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../../routes/model/routes_model";

const useAddBespokeClothesHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Draft-delete confirmation state for the "Products in draft" cards.
    const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);
    const [draftToDeleteId, setDraftToDeleteId] = useState<string>("");

    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const [getDraftProducts, { isLoading: isLoadingDraftProducts }] = useLazyGetDraftProductsQuery();
    const [deleteDraftProduct] = useDeleteDraftProductMutation();

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

    // Delete a draft product, then refresh the draft list (the delete endpoint
    // invalidates Products, so we refetch drafts explicitly here).
    const handleDeleteDraftProduct = async (productID: string) => {
        if (!productID) return;
        try {
            await deleteDraftProduct({ productIds: [productID] }).unwrap();
            await handleGetDraftProducts();
        } catch (error) {
            console.log("DELETE DRAFT PRODUCT ERROR::: ", error);
        } finally {
            setShowDeleteDraftModal(false);
            setDraftToDeleteId("");
        }
    };


    return {
        handleGetDraftProducts, isLoadingDraftProducts,
        handleResetProductMode,
        handleContinueSavedDraftProduct,
        handleDeleteDraftProduct,
        showDeleteDraftModal, setShowDeleteDraftModal,
        draftToDeleteId, setDraftToDeleteId,
        showWarningModal, setShowWarningModal,
        showSuccessModal, setShowSuccessModal,
    };
};

export default useAddBespokeClothesHook;