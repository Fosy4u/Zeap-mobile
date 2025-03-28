import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useSaveAutoPricePercentageMutation, useSubmitProductMutation } from "../../apis/bespokeProduct_api";

interface IProps {
    setShowWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStepSixHook = (
    setShowWarningModal: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }, 
    setShowSuccessModal: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }
) => {

    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState);
    const [isAutoPriceAdjustment, setIsAutoPriceAdjustment] = useState(false);
    const [autoPricePercentage, setAutoPricePercentage] = useState<string>("0");
    const [loadingMessage, setLoadingMessage] = useState<string>("");
    const [showPriceAdjustmentModal, setShowPriceAdjustmentModal] = useState<boolean>(false);
    const [priceAdjustmentModalType, setPriceAdjustmentModalType] = useState<string>("Activate");

    const [saveAutoPricePercentage, { isLoading: saveAutoPricePercentageIsLoading, isSuccess: saveAutoPricePercentageIsSuccess }] = useSaveAutoPricePercentageMutation();
    const [submitProduct, { isLoading: submitProductIsLoading, isSuccess: submitProductIsSuccess }] = useSubmitProductMutation();   


    // Handle save auto price percentage
    const handleSaveAutoPricePercentage = async () => {
        setLoadingMessage("Saving the auto price percentage...");
        const productId = selectedDraftProduct?.productId || "";

        try {
            // Update auto price adjustment
            const autoPriceAdjustmentData = {
                productId,
                isAdjustable: isAutoPriceAdjustment,
                adjustmentPercentage: Number(autoPricePercentage),
            };
            console.log("REQUEST DATA: ", autoPriceAdjustmentData);
            

            const saveAutoPricePercentageResponseData = await saveAutoPricePercentage(autoPriceAdjustmentData).unwrap();
            console.log("RESPONSE: ", saveAutoPricePercentageResponseData);

            if (saveAutoPricePercentageResponseData) {
                setLoadingMessage("");
                setAutoPricePercentage(saveAutoPricePercentageResponseData.autoPriceAdjustment!.adjustmentPercentage!.toString());
                setIsAutoPriceAdjustment(saveAutoPricePercentageResponseData.autoPriceAdjustment!.isAdjustable!);
                setShowPriceAdjustmentModal(false);
            }
        } catch (error) {
            console.log("ERROR: ", error);
            setLoadingMessage("");
            setShowPriceAdjustmentModal(false);
            return;
        }
    };

    // Handle deactivate auto price adjustment
    const handleDeactivateAutoPriceAdjustment = async () => {
        setLoadingMessage("Deactivating auto price adjustment...");
        const productId = selectedDraftProduct?.productId || "";

        try {
            // Update auto price adjustment
            const autoPriceAdjustmentData = {
                productId,
                isAdjustable: false,
                adjustmentPercentage: 0,
            };
            console.log("REQUEST DATA: ", autoPriceAdjustmentData);
            

            const saveAutoPricePercentageResponseData = await saveAutoPricePercentage(autoPriceAdjustmentData).unwrap();
            console.log("RESPONSE: ", saveAutoPricePercentageResponseData);

            if (saveAutoPricePercentageResponseData) {
                setLoadingMessage("");
                setAutoPricePercentage(saveAutoPricePercentageResponseData.autoPriceAdjustment!.adjustmentPercentage!.toString());
                setIsAutoPriceAdjustment(saveAutoPricePercentageResponseData.autoPriceAdjustment!.isAdjustable!);
                setShowPriceAdjustmentModal(false);
            }
        } catch (error) {
            console.log("ERROR: ", error);
            setLoadingMessage("");
            setShowPriceAdjustmentModal(false);
            return;
        }
    };

    // Handle submit product
    const handleSubmitProduct = async () => {
        setLoadingMessage("Submitting the product...");
        const productId = selectedDraftProduct?.productId || "";

        try {
            // Update auto price adjustment
            const submitProductData = {
                productId,
            };
            console.log("REQUEST DATA: ", submitProductData);

            const submitProductResponseData = await submitProduct(submitProductData).unwrap();
            console.log("RESPONSE: ", submitProductResponseData);

            if (submitProductResponseData) {
                setLoadingMessage("");
                setShowSuccessModal(true);
                setShowWarningModal(false);
            }
        } catch (error) {
            console.log("ERROR: ", error);
            setLoadingMessage("");
            return;
        }
    };
    
    // useEffect(() => {
    //     if (isAutoPriceAdjustment) {
    //         setShowPriceAdjustmentModal(true);
    //     } else {
    //         setShowPriceAdjustmentModal(false);
    //     }
    // }, [isAutoPriceAdjustment, setShowPriceAdjustmentModal]);

    useEffect(() => {
        if (selectedDraftProduct) {
            console.log("SELECTED DRAFT::: ", selectedDraftProduct);
            
            setAutoPricePercentage(selectedDraftProduct.autoPriceAdjustment!.adjustmentPercentage!.toString() || "0");
            setIsAutoPriceAdjustment(selectedDraftProduct.autoPriceAdjustment!.isAdjustable! || false);
        }
    }, [selectedDraftProduct]);


    return {
        autoPricePercentage, setAutoPricePercentage,
        handleSaveAutoPricePercentage, handleDeactivateAutoPriceAdjustment,
        saveAutoPricePercentageIsLoading, saveAutoPricePercentageIsSuccess, 
        isAutoPriceAdjustment, setIsAutoPriceAdjustment,
        submitProductIsLoading, submitProductIsSuccess, loadingMessage,
        handleSubmitProduct,
        showPriceAdjustmentModal, setShowPriceAdjustmentModal,
        priceAdjustmentModalType, setPriceAdjustmentModalType,
    };
};

export default useStepSixHook;