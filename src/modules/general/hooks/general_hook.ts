import { useDispatch } from "react-redux";
import { useLazyGetProductOptionsQuery } from "../apis/general_api";
import { setAccessoriesOptions, setBespokeClothesOptions, setBespokeShoesOptions, setProductTypes, setReadyMadeClothesOptions, setReadyMadeShoesOptions } from "../slices/general_slice";
import { SubmitHandler } from "react-hook-form";
import { ILikeReview } from "../validations/review_validation";
import { useDislikeReviewMutation, useLikeReviewMutation } from "../apis/review_api";


/**
 * The useGeneralHook
 * @returns { handleGetProductOptions }
 */
const useGeneralHook = () => {
    // const { readyMadeClothesOptions, readyMadeShoesOptions, bespokeClothesOptions, bespokeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();


    const [getProductOptions] = useLazyGetProductOptionsQuery();
    const [likeReview] = useLikeReviewMutation();
    const [dislikeReview] = useDislikeReviewMutation();
    
    const handleGetProductOptions = async () => {
        try {
            const productOptions = await getProductOptions().unwrap();

            // Dispatch to Redux Store
            dispatch(setProductTypes(productOptions.productTypeEnums!));
            dispatch(setReadyMadeClothesOptions(productOptions.readyMadeClothes!));
            dispatch(setReadyMadeShoesOptions(productOptions.readyMadeShoes!));
            dispatch(setBespokeClothesOptions(productOptions.bespokeClothes!));
            dispatch(setBespokeShoesOptions(productOptions.bespokeShoes!));
            dispatch(setAccessoriesOptions(productOptions.accessories!));
            // console.log("PRODUCT OPTIONS::: ", productOptions.readyMadeClothes!.colorEnums);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };


    
    const handleReviewLike: SubmitHandler<ILikeReview> = async (data) => {
        try {
            const likeResponse = await likeReview(data).unwrap();
            console.log("RESPONSE::: ", likeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    const handleReviewDislike: SubmitHandler<ILikeReview> = async (data) => {
        console.log("REQUEST DATA::: ", data);
        try {
            const dislikeResponse = await dislikeReview(data).unwrap();
            console.log("RESPONSE::: ", dislikeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    return {
        handleGetProductOptions,
        handleReviewLike, handleReviewDislike,
    };
};

export default useGeneralHook;