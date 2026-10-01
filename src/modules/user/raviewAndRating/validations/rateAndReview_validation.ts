import * as yup from "yup";

export const rateAndReviewFormSchema = yup.object().shape({
    // Rating field - must be at least 1 star
    rating: yup
        .number()
        .min(1, "Please tap a star to rate this product.")
        .required("Please tap a star to rate this product."),

    // Review title field - required with minimum length
    reviewTitle: yup
        .string()
        .required("A title is required.")
        .min(3, "The title needs at least 3 characters.")
        .max(100, "The title cannot exceed 100 characters."),

    // Reviewer name field - required with minimum length
    reviewerName: yup
        .string()
        .required("Your name is required.")
        .min(3, "Your name needs at least 3 characters.")
        .max(50, "Your name cannot exceed 50 characters."),

    // Detailed review field - required with minimum length
    detailedReview: yup
        .string()
        .required("A review is required.")
        .min(10, "Tell us a little more — at least 10 characters.")
        .max(1000, "The review cannot exceed 1000 characters."),

    // Image match field - required selection
    imageMatch: yup
        .string()
        .required("Please tell us whether the image matches the product.")
        .oneOf(["yes", "no"], "Please tell us whether the image matches the product."),
});

export type IRateAndReviewFormData = yup.InferType<typeof rateAndReviewFormSchema>;
export default rateAndReviewFormSchema;
