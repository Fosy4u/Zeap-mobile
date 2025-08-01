import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { stepThreeAddBespokeShoesSchema, stepThreeAddReadyMadeShoesSchema, } from "../../validations/addProduct_validation";
import { setLoadingMessage, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useUpdateProductMutation } from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";


const useStepThreeHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { readyMadeShoesOptions } = useSelector((state: RootState) => state.generalState);
    const [shoeSizes, setShoeSizes] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const dispatch = useDispatch();   

    const [updatedProduct] = useUpdateProductMutation();
    

    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Updating body measurements..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            const requestData = {
                productId,
                sizes: selectedSizes,
                currentStep: 3,
            };

            // Validate request data
            const validatedRequestData = await stepThreeAddReadyMadeShoesSchema.validate(requestData);
            // console.log("REQUEST DATA::: ", validatedRequestData);

            const updateWithBodyMeasurementsResponseData = await updatedProduct(validatedRequestData).unwrap();
            console.log("RESPONSE::: ", updateWithBodyMeasurementsResponseData);

            if (updateWithBodyMeasurementsResponseData) {
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setSelectedStep(4));
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        };
    };
    
    // Handle get peoduct body measurements
    const handleGetProductMeasurements = async () => {
        if (!readyMadeShoesOptions) return;
        
        setShoeSizes(readyMadeShoesOptions.shoeSizeEnums!);
    };

    useEffect(() => {
        if (readyMadeShoesOptions!) {
            handleGetProductMeasurements();
        }
    }, [readyMadeShoesOptions]);

    useEffect(() => {
        if (product && product.sizes?.length! > 0) {
            setSelectedSizes(product.sizes!);
        }
    }, [product]);


    return {
        shoeSizes, selectedSizes, setSelectedSizes,
        handleSubmit,
    };
};

export default useStepThreeHook;