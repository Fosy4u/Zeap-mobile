import { SubmitHandler, useForm } from "react-hook-form";
import { IStepOneAddBespokeClothes, stepOneAddBespokeClothesSchema } from "../../validations/addProduct_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useCreateProductMutation, useUpdateProductMutation } from "../../apis/bespokeProduct_api";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import IVendorProductDetails from "../../models/vendorProductDetails_model";
import { Alert } from "react-native";



const useStepOneHook = () => {
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const dispatch = useDispatch();

    const [createProduct] = useCreateProductMutation();
    const [updatedProduct] = useUpdateProductMutation();
    
    const { control, handleSubmit, formState: { errors } } = useForm<IStepOneAddBespokeClothes>({
        
        defaultValues: {
            title: product?.title || "",
            subTitle: product?.subTitle || "",
            description: product?.description || "",
            productType: "bespokeCloth",
            shopId: product?.shopId || userData?.shopId || "",
        },
        resolver: yupResolver(stepOneAddBespokeClothesSchema),
        mode: "onChange"
    });

    const onSubmit: SubmitHandler<IStepOneAddBespokeClothes> = async (data) => {
        dispatch(setLoadingMessage("Saving basic details..."));
        dispatch(setProductIsLoading(true));

        try {
            const createPayload = {
                title: data.title,
                subtitle: data.subTitle || "",
                description: data.description,
                productType: data.productType,
                shopId: data.shopId,
            };

            let createProductResponseData: IVendorProductDetails | undefined;
            if (!product?.productId) {
                dispatch(setLoadingMessage("Adding basic details..."));
                createProductResponseData = await createProduct(createPayload as any).unwrap();
            } else {
                dispatch(setLoadingMessage("Updating basic details..."));
                const updatePayload = {
                    ...createPayload,
                    productId: product.productId,
                    currentStep: product?.currentStep || 1,
                };
                createProductResponseData = await updatedProduct(updatePayload as any).unwrap();
            }

            if (createProductResponseData) {
                dispatch(setProduct(createProductResponseData));
                dispatch(setProductIsLoading(false));
                dispatch(setLoadingMessage(""));
                dispatch(setSelectedStep(2));
            }
        } catch (error: any) {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
            const message =
                error?.errors?.[0] ||
                error?.data?.error ||
                error?.data?.message ||
                error?.message ||
                "Something went wrong saving the basic details. Please try again.";
            Alert.alert("Error", message);
            console.log("STEP ONE SUBMIT ERROR::: ", error);
        }
    };



    return {
        control, handleSubmit, errors, onSubmit,
    };
};

export default useStepOneHook;
