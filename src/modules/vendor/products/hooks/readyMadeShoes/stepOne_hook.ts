import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useCreateProductMutation, useUpdateProductMutation } from "../../apis/readyMadeProduct_api";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { IStepOneAddProduct, stepOneAddProductSchema } from "../../validations/addProduct_validation";
import IVendorProductDetails from "../../models/vendorProductDetails_model";
import handleError from "../../../../general/hooks/errorHandler_hook";


const useStepOneHook = () => {
    const { productMode, product } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const dispatch = useDispatch();

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    
    const { control, handleSubmit, formState: { errors } } = useForm<IStepOneAddProduct>({
        
        defaultValues: {
            title: product?.title || "",
            subTitle: product?.subTitle || "",
            description: product?.description || "",
            productType: "readyMadeShoe",
            shopId: product?.shopId || userData?.shopId || "",
        },
        resolver: yupResolver(stepOneAddProductSchema),
        mode: "onChange" // Validate the form either "onChange" or "onBlur" or "onSubmit" or "all"
    });

    const onSubmit: SubmitHandler<IStepOneAddProduct> = async (data) => {
        dispatch(setProductIsLoading(true));

        try {
            const requestData = {
                title: data.title,
                subTitle: data.subTitle,
                description: data.description,
                productType: data.productType,
                productId: product?.productId! || "",
                shopId: data.shopId,
                currentStep: product?.currentStep! || 1,
            };
            console.log("REQUEST DATA::: ", requestData);

            let createProductResponseData: IVendorProductDetails | undefined;
            if (productMode === "New") {
                console.log("ADDING BESPOKE SHOES");
                dispatch(setLoadingMessage("Saving basic details..."));
                createProductResponseData = await createProduct(requestData).unwrap();
            } else {
                console.log("UPDATING BESPOKE SHOES");
                dispatch(setLoadingMessage("Updating basic details..."));
                createProductResponseData = await updateProduct(requestData).unwrap();
            }
            console.log("RESPONSE::: ", createProductResponseData);

            if (createProductResponseData) {
                dispatch(setProduct(createProductResponseData));
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setSelectedStep(2));
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };



    return {
        control, handleSubmit, errors, onSubmit,
    };
};

export default useStepOneHook;
