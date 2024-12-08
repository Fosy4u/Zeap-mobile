import * as yup from "yup";

const reviewSchema = yup.object().shape({
    title: yup
        .string()
        .required("Title is required."),
    rating: yup
        .number() 
        .typeError("Rating must be a number.")
        .min(1, "Rating must be at least 1.")
        .max(5, "Rating must not exceed 5.")
        .required("Rating is required."),
    review: yup
        .string()
        .required("Review comment is required."),
});

const likeReviewSchema = yup.object().shape({
    reviewId: yup
        .string()
        .required("Like is required."),
});

export type IReviewProduct = yup.InferType<typeof reviewSchema>;
export type ILikeReview = yup.InferType<typeof likeReviewSchema>;
export default reviewSchema;