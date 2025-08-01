import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setPendingReviews, setGivenReviews, setIsLoading, setLoadingMessage, setReviewOrder } from "../slices/reviewAndRating_slice";
import { useLazyGetAllReviewsQuery } from "../apis/reviewAndRating_api";
import handleError from "../../../general/hooks/errorHandler_hook";
import { rateAndReviewFormSchema, IRateAndReviewFormData } from "../validations/rateAndReview_validation";
import { RootState } from "../../../../redux/store/store";

const useReviewAndRatingHook = () => {
    const { reviewOrder } = useSelector((state: RootState) => state.reviewAndRatingState);
    const dispatch = useDispatch();

    const [getAllReviews] = useLazyGetAllReviewsQuery();

    // Form setup
    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<IRateAndReviewFormData>({
        defaultValues: {
            rating: 0,
            reviewTitle: "",
            reviewerName: "",
            detailedReview: "",
            imageMatch: "",
        },
        resolver: yupResolver(rateAndReviewFormSchema),
    });

    // Handle Get All Reviews
    const handleGetAllReviews = async () => {
        dispatch(setLoadingMessage("Getting reviews..."));
        dispatch(setIsLoading(true));

        try {
            const reviewsResponse = await getAllReviews().unwrap();
            console.log("REVIEWS RESPONSE", reviewsResponse);
            
            if (reviewsResponse) {
                dispatch(setPendingReviews(reviewsResponse.pendingReviews));
                dispatch(setGivenReviews(reviewsResponse.givenReviews));
                // Only set reviewOrder if there are pending reviews
                if (reviewsResponse.pendingReviews && reviewsResponse.pendingReviews.length > 0) {
                    dispatch(setReviewOrder(reviewsResponse.pendingReviews[0].order));
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle Submit Review
    const onSubmit: SubmitHandler<IRateAndReviewFormData> = async (data) => {
        // Check if reviewOrder is available
        if (!reviewOrder) {
            console.error("No review order data available");
            return;
        }

        dispatch(setLoadingMessage("Submitting review..."));
        dispatch(setIsLoading(true));

        // Format the request data according to the API payload structure
        const requestData = {
            displayName: data.reviewerName,
            imageMatch: data.imageMatch === "yes" ? true : false,
            orderId: reviewOrder.orderId || "",
            productId: reviewOrder.productId || "",
            rating: data.rating,
            review: data.detailedReview,
            title: data.reviewTitle,
        };
        console.log("REQUEST DATA::: ", requestData);
        
        try {
            // TODO: Implement API call to submit review
            // const response = await submitReview(requestData).unwrap();
            
            // Reset form after successful submission
            // reset();
            
            // TODO: Show success message and navigate back
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };
    
    return {
        control, handleSubmit, errors, setValue, reset, onSubmit,
        handleGetAllReviews,
    };
};

export default useReviewAndRatingHook; 