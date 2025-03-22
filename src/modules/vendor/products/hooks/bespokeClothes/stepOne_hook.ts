import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IStepOneAddBespokeClothes, IStepTwoAddBespokeClothes, stepOneAddBespokeClothesSchema, stepTwoAddBespokeClothesSchema } from "../../validations/addBespokeClothes_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useAddBespokeClothesMutation } from "../../apis/bespokeProduct_api";



const useStepOneHook = () => {
    const { selectedDraftProduct } = useSelector((state: RootState) => state.vendorProductState );
    const { userData } = useSelector((state: RootState) => state.profileState );
    const [loadingMessage, setLoadingMessage] = useState("");

    const [addBespokeClothes , { isLoading, isSuccess }] = useAddBespokeClothesMutation();
    
    const { control, handleSubmit, formState: { errors } } = useForm<IStepOneAddBespokeClothes>({
        defaultValues: {
            title: selectedDraftProduct?.title || "",
            subTitle: selectedDraftProduct?.subTitle || "",
            description: selectedDraftProduct?.description || "",
            productType: "bespokeCloth",
            shopId: selectedDraftProduct?.shopId || userData?.shopId || "",
        },
        resolver: yupResolver(stepOneAddBespokeClothesSchema),
        mode: "onChange" // Validate the form either "onChange" or "onBlur" or "onSubmit" or "all"
    });

    const onSubmit: SubmitHandler<IStepOneAddBespokeClothes> = async (data) => {
        setLoadingMessage("Saving basic details...");

        try {
            const requestData = {
                title: data.title,
                subTitle: data.subTitle,
                description: data.description,
                productType: data.productType,
                shopId: data.shopId,
            };
            console.log("REQUEST DATA::: ", requestData);

            const addBespokeClothesResponseData = await addBespokeClothes(requestData).unwrap();
            // console.log("RESPONSE::: ", addBespokeClothesResponse);

            if (addBespokeClothesResponseData) {
                setLoadingMessage("");
            }
        } catch (error) {
            console.log("ERROR::: ", error);
                
        }
    };



    return {
        control, handleSubmit, errors, onSubmit,
        isSuccess, isLoading, loadingMessage,
    };
};

export default useStepOneHook;
