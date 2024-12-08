import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import reviewSchema, { ILikeReview, IReviewProduct } from "../validations/review_validation";
import { useCreateReviewMutation, useDilikeReviewMutation, useLikeReviewMutation } from "../apis/review_api";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";


const useReviewsHook = (productID: string | undefined) => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const [createReview] = useCreateReviewMutation();
    const [likeReview] = useLikeReviewMutation();
    const [dilikeReview] = useDilikeReviewMutation();
    const [isLoading, setIsLoading] = useState(false);


    const { handleSubmit, control, formState: { errors }, reset } = useForm<IReviewProduct>({
        defaultValues: {
            title: "",
            rating: 0,
            review: "",
        },
        resolver: yupResolver(reviewSchema)
    });

    const onSubmit: SubmitHandler<IReviewProduct> =  async(data) => {
        setIsLoading(true);

        const requestData = {
            productId: productID,
            displayName: `${userData.firstName} ${userData.lastName}`,
            title: data.title,
            rating: data.rating,
            imageMatch: true,
            review: data.review,
        }
        // console.log("REQUEST DATA::: ", requestData);
        
        try {
            const reviewResponse = await createReview(requestData).unwrap();

            // Reset form to default values
            reset();
            console.log("RESPONSE::: ", reviewResponse);
        setIsLoading(false);
            
        } catch (error) {
            setIsLoading(false);
            console.log("ERROR::: ", error);
        } finally {
            setIsLoading(false);
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
            const dislikeResponse = await dilikeReview(data).unwrap();
            console.log("RESPONSE::: ", dislikeResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        };
    };
    return { onSubmit, handleSubmit, handleReviewLike, handleReviewDislike, control, errors, isLoading };
};

export default useReviewsHook;