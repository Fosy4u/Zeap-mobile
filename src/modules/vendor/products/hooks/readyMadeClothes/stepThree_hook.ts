import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { RootState } from "../../../../../redux/store/store";
import { stepThreeAddReadyMadeClothesSchema } from "../../validations/addProduct_validation";
import { Alert } from "react-native";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useLazyGetProductByProductIDQuery, useUpdateProductMutation } from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";


const useStepThreeHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { readyMadeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const [clotheSizes, setClotheSizes] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const dispatch = useDispatch();   

    const [updatedProduct] = useUpdateProductMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();
    

    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Adding product sizes..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            const requestData = {
                productId,
                sizes: selectedSizes,
                currentStep: 3,
            };

            // Validate request data
            const validatedRequestData = await stepThreeAddReadyMadeClothesSchema.validate(requestData);
            // console.log("REQUEST DATA::: ", JSON.stringify(validatedRequestData));

            const updatedProductResponseData = await updatedProduct(validatedRequestData).unwrap();
            // console.log("RESPONSE::: ", updateWithBodyMeasurementsResponseData);

            if (updatedProductResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));

                // Get the updated product data
                const updatedProduct = await getProductByProductID(productId).unwrap();
                console.log("UPDATED PRODUCT::: ", updatedProduct);

                if (updatedProduct) {
                    dispatch(setProduct(updatedProduct));
                    dispatch(setProductIsLoading(false));
                    dispatch(setLoadingMessage(""));
                    dispatch(setSelectedStep(4));
                }
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        };
    };
    
    // Handle get peoduct body measurements
    const handleGetProductBodyMeasurements = async () => {
        if (!readyMadeClothesOptions) return;
        
        const clotheSizes = readyMadeClothesOptions.clothSizeEnums!;
        setClotheSizes(clotheSizes);
    };

    // Handle set selected sizes
    const handleSelectSizes = () => {
        if (!product) return;

        const selectedSizes = product.sizes!;
        setSelectedSizes(selectedSizes);
        // console.log("SELECTED SIZES: ", selectedSizes);     
    };



    useEffect(() => {
        if (product) {
            handleGetProductBodyMeasurements();
        }
    }, [readyMadeClothesOptions]);
    useEffect(() => {
        handleSelectSizes();
    }, [product]);



    return {
        clotheSizes, selectedSizes, setSelectedSizes,
        handleSubmit,
    };
};

export default useStepThreeHook;