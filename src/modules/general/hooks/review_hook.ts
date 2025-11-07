import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { setLoadingMessage, setIsLoading } from "../slices/general_slice";
import reviewSchema, { IReviewProduct } from "../validations/review_validation";
import handleError from "./errorHandler_hook";
import { useCreateReviewMutation, useLazyGetProductReviewsQuery } from "../apis/review_api";
import { useEffect, useState } from "react";
import IReviewIndicator from "../models/reviewIndicator_model";
import IReviewAndRating from "../models/review_model";
import { setReviewAndRating } from "../../vendor/products/slices/vendorProductState_slice";

const useReviewHook = (productId?: string) => {
    const { reviewAndRating} = useSelector((state: RootState) => state.vendorProductState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();

    const [state, setState] = useState<{
        reviewIndicators: IReviewIndicator[];
      }>({
        reviewIndicators: [
          { rate: 5, count: 0, percentage: 0 },
          { rate: 4, count: 0, percentage: 0 },
          { rate: 3, count: 0, percentage: 0 },
          { rate: 2, count: 0, percentage: 0 },
          { rate: 1, count: 0, percentage: 0 },
        ],
      });

    const [getProductReviews] = useLazyGetProductReviewsQuery();
    const [createReview, { isLoading: isLoadingAddReview }] = useCreateReviewMutation();
    

    const { handleSubmit, control, formState: { errors }, reset } = useForm<IReviewProduct>({
        defaultValues: {
            title: "",
            rating: 0,
            review: "",
        },
        resolver: yupResolver(reviewSchema)
    });

    const onSubmit: SubmitHandler<IReviewProduct> =  async(data) => {
        setLoadingMessage("Submitting review...");
        dispatch(setIsLoading(true));

        const requestData = {
            productId: productId,
            displayName: `${userData.firstName} ${userData.lastName}`,
            title: data.title,
            rating: data.rating,
            imageMatch: true,
            review: data.review,
        }
        console.log("REQUEST DATA::: ", requestData);

        try {
            const reviewResponse = await createReview(requestData).unwrap();

            if (reviewResponse) {
                reset();
                dispatch(setIsLoading(false));
                setLoadingMessage("");
                // console.log("RESPONSE::: ", reviewResponse);
            }
        } catch (error: any) {
            dispatch(setIsLoading(false));
            setLoadingMessage("");
            handleError(error);
        }
    };


    // Handle get product reviews
    const handleGetProductReviews = async (productID: string) => {
        dispatch(setLoadingMessage("Fetching reviews..."));  
        dispatch(setIsLoading(true));     

        try {
            const reviewsResponse = await getProductReviews(productID!).unwrap();
            // console.log("REVIEWS RESPONSE: ", reviewsResponse);            

            if (reviewsResponse) {
                dispatch(setReviewAndRating(reviewsResponse));
                dispatch(setIsLoading(false));
                dispatch(setLoadingMessage(""));
            }
        } catch (error) {
            dispatch(setIsLoading(true));
            dispatch(setLoadingMessage(""));
            handleError(error);
        }
    };


      const calculateReviewPercentage = () => {
        for (let i = 0; i < 5; i++) {
          const rate = i + 1;
          const count = reviewAndRating.reviews!.filter((review) => review.rating === i + 1).length;
          const percentage = (count / reviewAndRating.reviews!.length) * 100;
          // console.log("STATE::: ", state.reviewIndicators[0].count);
          
          // Update state
          setState((prevState: any) => ({
            ...prevState,
            reviewIndicators: prevState.reviewIndicators.map((indicator: IReviewIndicator) => {
              if (indicator.rate === rate) {
                return { ...indicator, count, percentage };
              }
              return indicator;
            }),
          }));
        }
      };
    
      useEffect(() => {
        calculateReviewPercentage();
      }, []);

    return {
        onSubmit, handleSubmit, isLoadingAddReview, control, errors,
        handleGetProductReviews,
        reviewIndicators: state.reviewIndicators
    };
};

export default useReviewHook;
