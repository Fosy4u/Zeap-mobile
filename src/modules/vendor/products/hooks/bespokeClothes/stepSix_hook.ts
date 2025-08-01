import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useSaveAutoPricePercentageMutation, useSubmitProductMutation } from "../../apis/bespokeProduct_api";
import { setLoadingMessage, setProduct, setProductIsLoading } from "../../slices/vendorProductState_slice";

interface IProps {
    setShowWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStepSixHook = (
    setShowWarningModal: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }, 
    setShowSuccessModal: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }
) => {

    const { product } = useSelector((state: RootState) => state.vendorProductState);
    const [isAutoPriceAdjustment, setIsAutoPriceAdjustment] = useState(false);
    const [autoPricePercentage, setAutoPricePercentage] = useState<string>("0");
    const [showPriceAdjustmentModal, setShowPriceAdjustmentModal] = useState<boolean>(false);
    const [priceAdjustmentModalType, setPriceAdjustmentModalType] = useState<string>("Activate");
    const dispatch = useDispatch();

    const [saveAutoPricePercentage, { isLoading: saveAutoPricePercentageIsLoading, isSuccess: saveAutoPricePercentageIsSuccess }] = useSaveAutoPricePercentageMutation();
    const [submitProduct, { isLoading: submitProductIsLoading, isSuccess: submitProductIsSuccess }] = useSubmitProductMutation();   


    // Handle save auto price percentage
    const handleSaveAutoPricePercentage = async () => {
        dispatch(setLoadingMessage("Saving the auto price percentage..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            // Update auto price adjustment
            const autoPriceAdjustmentData = {
                productId,
                isAdjustable: isAutoPriceAdjustment,
                adjustmentPercentage: Number(autoPricePercentage),
                currentStep: 6,
            };
            console.log("REQUEST DATA: ", autoPriceAdjustmentData);
            

            const saveAutoPricePercentageResponseData = await saveAutoPricePercentage(autoPriceAdjustmentData).unwrap();
            console.log("RESPONSE: ", saveAutoPricePercentageResponseData);

            if (saveAutoPricePercentageResponseData) {
                setAutoPricePercentage(saveAutoPricePercentageResponseData.autoPriceAdjustment!.adjustmentPercentage!.toString());
                setIsAutoPriceAdjustment(saveAutoPricePercentageResponseData.autoPriceAdjustment!.isAdjustable!);
                setShowPriceAdjustmentModal(false);
                dispatch(setProduct(saveAutoPricePercentageResponseData));
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            console.log("ERROR: ", error);
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            setShowPriceAdjustmentModal(false);
            return;
        }
    };

    // Handle deactivate auto price adjustment
    const handleDeactivateAutoPriceAdjustment = async () => {
        dispatch(setLoadingMessage("Deactivating auto price adjustment..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            // Update auto price adjustment
            const autoPriceAdjustmentData = {
                productId,
                isAdjustable: false,
                adjustmentPercentage: 0,
                currentStep: 6,
            };
            console.log("REQUEST DATA: ", autoPriceAdjustmentData);
            

            const saveAutoPricePercentageResponseData = await saveAutoPricePercentage(autoPriceAdjustmentData).unwrap();
            console.log("RESPONSE: ", saveAutoPricePercentageResponseData);

            if (saveAutoPricePercentageResponseData) {
                setAutoPricePercentage(saveAutoPricePercentageResponseData.autoPriceAdjustment!.adjustmentPercentage!.toString());
                setIsAutoPriceAdjustment(saveAutoPricePercentageResponseData.autoPriceAdjustment!.isAdjustable!);
                setShowPriceAdjustmentModal(false);
                dispatch(setProduct(saveAutoPricePercentageResponseData));
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            console.log("ERROR: ", error);
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            setShowPriceAdjustmentModal(false);
            return;
        }
    };

    // Handle submit product
    const handleSubmitProduct = async () => {
        dispatch(setLoadingMessage("Submitting the product..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            // Update auto price adjustment
            const submitProductData = {
                productId,
            };
            console.log("REQUEST DATA: ", submitProductData);

            const submitProductResponseData = await submitProduct(submitProductData).unwrap();
            console.log("RESPONSE: ", submitProductResponseData);

            if (submitProductResponseData) {
                dispatch(setProduct(submitProductResponseData));
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                setShowSuccessModal(true);
                setShowWarningModal(false);
            }
        } catch (error) {
            console.log("ERROR: ", error);
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            return;
        }
    };

    // Handle set auto price adjustment from the draft product
    const handleSetAutoPriceAdjustment = () => {
        if (!product) return;
        const autoPriceAdjustment = product.autoPriceAdjustment!;

        if (autoPriceAdjustment) {
            setAutoPricePercentage(autoPriceAdjustment.adjustmentPercentage!.toString() || "0");
            setIsAutoPriceAdjustment(autoPriceAdjustment.isAdjustable! || false);
        }
    };

    useEffect(() => {
        handleSetAutoPriceAdjustment();
    }, [product]);


    return {
        autoPricePercentage, setAutoPricePercentage,
        handleSaveAutoPricePercentage, handleDeactivateAutoPriceAdjustment,
        saveAutoPricePercentageIsLoading, saveAutoPricePercentageIsSuccess, 
        isAutoPriceAdjustment, setIsAutoPriceAdjustment,
        submitProductIsLoading, submitProductIsSuccess,
        handleSubmitProduct,
        showPriceAdjustmentModal, setShowPriceAdjustmentModal,
        priceAdjustmentModalType, setPriceAdjustmentModalType,
    };
};

export default useStepSixHook;