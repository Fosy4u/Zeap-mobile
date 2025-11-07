import * as yup from "yup";

/**
 * Rate and Review Form Validation Schema
 * Validates all fields in the review submission form
 */
export const rateAndReviewFormSchema = yup.object().shape({
    // Rating field - must be at least 1 star
    rating: yup
        .number()
        .min(1)
        .required(""),

    // Review title field - required with minimum length
    reviewTitle: yup
        .string()
        .required("")
        .min(3, "")
        .max(100, ""),

    // Reviewer name field - required with minimum length
    reviewerName: yup
        .string()
        .required("")
        .min(3, "")
        .max(50, ""),

    // Detailed review field - required with minimum length
    detailedReview: yup
        .string()
        .required("")
        .min(10, "")
        .max(1000, ""),

    // Image match field - required selection
    imageMatch: yup
        .string()
        .required("")
        .oneOf(["yes", "no"], ""),
});

export type IRateAndReviewFormData = yup.InferType<typeof rateAndReviewFormSchema>;
export default rateAndReviewFormSchema; 