import { SubmitHandler, useForm } from "react-hook-form";
import { IStepOneAddProduct, stepOneAddProductSchema } from "../../validations/addProduct_validation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import IVendorProductDetails from "../../models/vendorProductDetails_model";
import { useCreateProductMutation, useUpdateProductMutation } from "../../apis/accessoryProduct_api";
import { Alert } from "react-native";

const useStepOneHook = () => {
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const dispatch = useDispatch();

    const [createProduct] = useCreateProductMutation();
    const [updatedProduct] = useUpdateProductMutation();

    const { control, handleSubmit, formState: { errors } } = useForm<IStepOneAddProduct>({ 
        defaultValues: {
            title: product?.title || "",
            subTitle: product?.subTitle || "",
            description: product?.description || "",
            productType: "accessory",
            shopId: product?.shopId || userData?.shopId || "",
        },
        resolver: yupResolver(stepOneAddProductSchema),
        mode: "onChange" // Validate the form either "onChange" or "onBlur" or "onSubmit" or "all"
    });

     const onSubmit: SubmitHandler<IStepOneAddProduct> = async (data) => {
            dispatch(setLoadingMessage("Saving basic details..."));
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
                if (!product || Object.entries(product).length === 0) {
                    console.log("ADDING ACCESSORIES");
                    dispatch(setLoadingMessage("Adding basic details..."));
                    createProductResponseData = await createProduct(requestData).unwrap();
                } else {
                    console.log("UPDATING ACCESSORIES");
                    dispatch(setLoadingMessage("Updating basic details..."));
                    createProductResponseData = await updatedProduct(requestData).unwrap();
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
                Alert.alert("Error", error.errors[0]);
                console.log("ERROR::: ", error);
            }
        };
    

    return {
        control, handleSubmit, errors, onSubmit,
    };
};

export default useStepOneHook;