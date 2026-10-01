import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useCreateProductMutation, useUpdateProductMutation } from "../../apis/readyMadeProduct_api";
import { setLoadingMessage, setProduct, setProductIsLoading, setSelectedStep } from "../../slices/vendorProductState_slice";
import { IStepOneAddReadyMadeClothes, stepOneAddReadyMadeClothesSchema } from "../../validations/addProduct_validation";
import IVendorProductDetails from "../../models/vendorProductDetails_model";
import { Alert } from "react-native";



const useStepOneHook = () => {
    const { product } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const dispatch = useDispatch();

    const [createProduct] = useCreateProductMutation();
    const [updatedProduct] = useUpdateProductMutation();

    const { control, handleSubmit, formState: { errors } } = useForm<IStepOneAddReadyMadeClothes>({

        defaultValues: {
            title: product?.title || "",
            subTitle: product?.subTitle || "",
            description: product?.description || "",
            productType: "readyMadeCloth",
            shopId: product?.shopId || userData?.shopId || "",
        },
        resolver: yupResolver(stepOneAddReadyMadeClothesSchema),
        mode: "onChange" // Validate the form either "onChange" or "onBlur" or "onSubmit" or "all"
    });

    const onSubmit: SubmitHandler<IStepOneAddReadyMadeClothes> = async (data) => {
        dispatch(setLoadingMessage("Saving basic details..."));
        dispatch(setProductIsLoading(true));

        try {
            // POST /product/create payload. NOTE the API field is `subtitle`
            // (lowercase t) — the form/schema field is `subTitle`, so it's
            // mapped here.
            const createPayload = {
                title: data.title,
                subtitle: data.subTitle || "",
                description: data.description,
                productType: data.productType,
                shopId: data.shopId,
            };

            // Create vs. update keys off a real productId — a new product is
            // seeded as `{}` (truthy), so `!product` would wrongly route it into
            // the update branch with an empty productId.
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
