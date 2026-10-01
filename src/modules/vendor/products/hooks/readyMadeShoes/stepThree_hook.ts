import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { stepThreeAddReadyMadeShoesSchema } from "../../validations/addProduct_validation";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { useLazyGetProductByProductIDQuery, useUpdateProductMutation } from "../../apis/readyMadeProduct_api";
import handleError from "../../../../general/hooks/errorHandler_hook";


const useStepThreeHook = () => {

    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { readyMadeShoesOptions } = useSelector((state: RootState) => state.generalState);
    const [selectedSizeStandard, setSelectedSizeStandard] = useState<string>("");
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [showSizesDropDown, setShowSizesDropDown] = useState(false);
    const dispatch = useDispatch();

    const [updatedProduct] = useUpdateProductMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();

    // The available size standards (AUS, CAN, EU, INTL, UK, US) for shoes.
    const sizeStandardOptions = readyMadeShoesOptions?.sizeStandardEnums ?? [];

    // Sizes available for the chosen standard — empty until one is picked.
    const shoeSizes = selectedSizeStandard
        ? (readyMadeShoesOptions?.shoeSizeEnumsByRegion?.[selectedSizeStandard] ?? [])
        : [];


    // Handle submit
    const handleSubmit = async () => {
        dispatch(setLoadingMessage("Adding product sizes..."));
        dispatch(setProductIsLoading(true));
        const productId = product?.productId || "";

        try {
            const requestData = {
                productId,
                sizeStandard: selectedSizeStandard,
                sizes: selectedSizes,
                currentStep: 3,
            };

            // Validate request data
            const validatedRequestData = await stepThreeAddReadyMadeShoesSchema.validate(requestData);

            const updatedProductResponseData = await updatedProduct(validatedRequestData).unwrap();

            if (updatedProductResponseData) {
                dispatch(setLoadingMessage("Getting product details..."));

                // Get the updated product data
                const updated = await getProductByProductID(productId).unwrap();

                if (updated) {
                    dispatch(setProduct(updated));
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

    // Choosing a standard switches the size list — drop any previously-picked
    // sizes that don't exist under the new standard.
    const handleSelectSizeStandard = (standard: string) => {
        setSelectedSizeStandard(standard);
        const regionSizes = readyMadeShoesOptions?.shoeSizeEnumsByRegion?.[standard] ?? [];
        setSelectedSizes((prev) => prev.filter((size) => regionSizes.includes(size)));
    };

    // Pre-fill standard + sizes when editing a draft product.
    const handleSelectSizes = () => {
        if (!product) return;
        if ((product as any).sizeStandard) setSelectedSizeStandard((product as any).sizeStandard);
        if (product.sizes) setSelectedSizes(product.sizes);
    };


    useEffect(() => {
        handleSelectSizes();
    }, [product]);


    return {
        sizeStandardOptions,
        selectedSizeStandard, handleSelectSizeStandard,
        shoeSizes, selectedSizes, setSelectedSizes,
        showSizesDropDown, setShowSizesDropDown,
        handleSubmit,
    };
};

export default useStepThreeHook;
