import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setPendingReviews, setGivenReviews, setIsLoading, setLoadingMessage } from "../slices/reviewAndRating_slice";
import { useLazyGetAllReviewsQuery } from "../apis/reviewAndRating_api";
import { useCreateReviewMutation, useUpdateReviewMutation } from "../../../general/apis/review_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import handleError from "../../../general/hooks/errorHandler_hook";
import { rateAndReviewFormSchema, IRateAndReviewFormData } from "../validations/rateAndReview_validation";
import { RootState } from "../../../../redux/store/store";
import ICreateReviewPayload, { IUpdateReviewPayload } from "../../../general/models/createReviewPayload_model";
import { Alert } from "react-native";
import showToast from "../../../../utils/showToast";

const useReviewAndRatingHook = () => {
    const { reviewOrder } = useSelector((state: RootState) => state.reviewAndRatingState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const [getAllReviews] = useLazyGetAllReviewsQuery();
    const [createReview] = useCreateReviewMutation();
    const [updateReview] = useUpdateReviewMutation();

    /* A pending entry has no review of its own; a given one does, and that is
       what turns this screen from "rate" into "view or edit". */
    const isEditing = !!reviewOrder?.reviewId;

    /* Existing reviews open populated; a new one starts empty except for the
       name, which the API requires and the profile already knows. */
    const buildFormValues = (): IRateAndReviewFormData => ({
        rating: reviewOrder?.rating ?? 0,
        reviewTitle: reviewOrder?.reviewTitle ?? "",
        reviewerName: reviewOrder?.displayName || [userData?.firstName, userData?.lastName].filter(Boolean).join(" "),
        detailedReview: reviewOrder?.reviewBody ?? "",
        imageMatch: reviewOrder?.imageMatch === undefined ? "" : (reviewOrder.imageMatch ? "yes" : "no"),
    });

    // Form setup
    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<IRateAndReviewFormData>({
        defaultValues: buildFormValues(),
        resolver: yupResolver(rateAndReviewFormSchema),
    });

    /* navigate() reuses a screen already in the stack, so opening a different
       entry would otherwise keep the previous one's answers on screen. */
    useEffect(() => {
        reset(buildFormValues());
    }, [reviewOrder?.reviewId, reviewOrder?.productId, reviewOrder?.orderId]);

    // Handle Get All Reviews
    const handleGetAllReviews = async () => {
        dispatch(setLoadingMessage("Getting reviews..."));
        dispatch(setIsLoading(true));

        try {
            const reviewsResponse = await getAllReviews().unwrap();
            console.log("REVIEWS RESPONSE", reviewsResponse);
            
            if (reviewsResponse) {
                dispatch(setPendingReviews(reviewsResponse.pendingReviews ?? []));
                dispatch(setGivenReviews(reviewsResponse.givenReviews ?? []));

            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const onInvalid: SubmitErrorHandler<IRateAndReviewFormData> = (formErrors) => {
        const firstMessage = [
            formErrors.rating,
            formErrors.reviewTitle,
            formErrors.reviewerName,
            formErrors.detailedReview,
            formErrors.imageMatch,
        ].find((fieldError) => !!fieldError?.message)?.message;

        showToast(firstMessage ?? "Please complete every field before submitting.");
    };

    // Handle Submit Review
    const onSubmit: SubmitHandler<IRateAndReviewFormData> = async (data) => {
        // Check if reviewOrder is available
        if (!reviewOrder) {
            console.error("No review order data available");
            return;
        }

        dispatch(setLoadingMessage(isEditing ? "Updating review..." : "Submitting review..."));
        dispatch(setIsLoading(true));

        /* An edit addresses the review by its own id; a new one is pinned to the
           purchase, where sku identifies the exact variation that was bought. */
        const requestData: ICreateReviewPayload | IUpdateReviewPayload = isEditing
            ? {
                productId: reviewOrder.productId,
                review_id: reviewOrder.reviewId!,
                review: data.detailedReview,
                title: data.reviewTitle,
                rating: data.rating,
                displayName: data.reviewerName,
                imageMatch: data.imageMatch === "yes",
            }
            : {
                productId: reviewOrder.productId,
                orderId: reviewOrder.orderId,
                sku: reviewOrder.sku,
                review: data.detailedReview,
                title: data.reviewTitle,
                rating: data.rating,
                displayName: data.reviewerName,
                imageMatch: data.imageMatch === "yes",
            };

        try {
            const reviewResponse = isEditing
                ? await updateReview(requestData as IUpdateReviewPayload).unwrap()
                : await createReview(requestData as ICreateReviewPayload).unwrap();

            if (reviewResponse) {
                reset();
                await handleGetAllReviews();
                Alert.alert(
                    isEditing ? "Review updated" : "Review submitted",
                    isEditing ? "Your review has been updated." : "Thank you for reviewing this product.",
                    [{ text: "OK", onPress: () => navigation.goBack() }],
                );
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };
    
    return {
        control, handleSubmit, errors, setValue, reset, onSubmit, onInvalid,
        handleGetAllReviews, isEditing,
    };
};

export default useReviewAndRatingHook; 