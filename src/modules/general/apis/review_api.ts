import rootAPI from "../../../redux/api/rootAPI.ts";
import { createReviewRoute, updateReviewRoute } from "../../../redux/api/api_route";
import IReviewAndRating from "../models/review_model";
import ICreateReviewPayload, { IUpdateReviewPayload } from "../models/createReviewPayload_model";
import { ILikeReview } from "../validations/review_validation";

// 4.3 ({reviewData?.reviews?.length} { reviewData?.reviews?.length! > 1 ? "reviews" : "review" })
const reviewAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Add a review
        createReview: builder.mutation<any, ICreateReviewPayload>({
            query: (requestData) => ({
                url: createReviewRoute,
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["Reviews", "VendorProductPreview"],
            transformResponse: (response) => {
                return response;
            }
        }),

        // Edit an existing review
        updateReview: builder.mutation<any, IUpdateReviewPayload>({
            query: (requestData) => ({
                url: updateReviewRoute,
                method: "PUT",
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
    useUpdateReviewMutation,
    useLazyGetProductReviewsQuery,
    useLikeReviewMutation,
    useDislikeReviewMutation,
} = reviewAPI;
export default reviewAPI;
