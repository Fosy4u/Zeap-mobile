import { useDispatch, useSelector } from "react-redux";
import { useLazyGetProductOptionsQuery } from "../apis/general_api";
import { setAccessoriesOptions, setBespokeClothesOptions, setBespokeShoesOptions, setProductTypes, setReadyMadeClothesOptions, setReadyMadeShoesOptions } from "../slices/general_slice";
import { SubmitHandler } from "react-hook-form";
import { ILikeReview } from "../validations/review_validation";
import { useDislikeReviewMutation, useLikeReviewMutation } from "../apis/review_api";
import { RootState } from "../../../redux/store/store";
import { useState, useEffect } from "react";


/**
 * The useGeneralHook
 * @returns { handleGetProductOptions }
 */
const useGeneralHook = () => {
    const { readyMadeClothesOptions } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();


    const [getProductOptions] = useLazyGetProductOptionsQuery();
    const [likeReview] = useLikeReviewMutation();
    const [dislikeReview] = useDislikeReviewMutation();

    /**
     * Generates a random integer between 0 and max (inclusive)
     * @param {number} max - The upper bound of the random number range
     * @return {number} A random integer between 0 and max
     */
    const generateRandomInteger = (max: number): number => {
        return Math.floor(Math.random() * (max + 1));
    }
    
    // Handle get product options
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
    
    // Handle review like
    const handleReviewLike: SubmitHandler<ILikeReview> = async (data) => {
        try {
            const likeResponse = await likeReview(data).unwrap();
            console.log("RESPONSE::: ", likeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    // Handle review dislike
    const handleReviewDislike: SubmitHandler<ILikeReview> = async (data) => {
        console.log("REQUEST DATA::: ", data);
        try {
            const dislikeResponse = await dislikeReview(data).unwrap();
            console.log("RESPONSE::: ", dislikeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };

    // Hndle get color code
    const getColorCode: (colorName: string) => string = (colorName: string) => {
        const colors = readyMadeClothesOptions.colorEnums;
        const color = colors!.find(color => color.name === colorName);
        return color?.hex!;
    };
    
    // Enforce rerender every minute to update timeAgo
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return {
        generateRandomInteger,
        handleGetProductOptions,
        handleReviewLike, handleReviewDislike,
        getColorCode,
    };
};

export default useGeneralHook;