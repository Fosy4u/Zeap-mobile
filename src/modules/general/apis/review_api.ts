import rootAPI from "../../../redux/api/rootAPI.ts";
import IReviewAndRating from "../models/review_model";
import IReview from "../models/review_model";
import { ILikeReview, IReviewProduct } from "../validations/review_validation";

// 4.3 ({reviewData?.reviews?.length} { reviewData?.reviews?.length! > 1 ? "reviews" : "review" })
const reviewAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Add a review
        createReview: builder.mutation<any, IReviewProduct>({
            query: (requestData) => ({
                url: "/review/create",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["Reviews", "VendorProductPreview"],
            transformResponse: (response) => {
                return response;
            }
        }),

        // Get product reviews
        getProductReviews: builder.query<IReviewAndRating, string>({
            query: (productID) => ({
                url: `/reviews?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags: ["Reviews"],
            transformResponse: (response: { data: IReviewAndRating }) => {
                return response.data;
            }
        }),

        // Like a review
        likeReview: builder.mutation<any, ILikeReview>({
            query: (requestData) => ({
                url: "/review/update/likeReview",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["Reviews", "VendorProductPreview"],
            transformResponse: (response) => {
                return response;
            }
        }),

        // Dislike a review
        dislikeReview: builder.mutation<any, ILikeReview>({
            query: (requestData) => ({
                url: "/review/update/dislikeReview",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["Reviews", "VendorProductPreview"],
            transformResponse: (response) => {
                return response;
            }
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useLazyGetProductReviewsQuery,
    useLikeReviewMutation,
    useDislikeReviewMutation,
} = reviewAPI;
export default reviewAPI;
