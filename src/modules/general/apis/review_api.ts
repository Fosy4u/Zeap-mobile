import api from "../../../redux/api/api";
import IReview from "../models/review_model";
import IVendorPreview from "../models/vendorReview_model";
import { ILikeReview, IReviewProduct } from "../validations/review_validation";

// 4.3 ({reviewData?.reviews?.length} { reviewData?.reviews?.length! > 1 ? "reviews" : "review" })
const reviewAPI = api.injectEndpoints({
    endpoints: (builder) => ({

        // Add a review
        createReview: builder.mutation<any, IReviewProduct>({
            query: (requestData) => ({
                url: "/review/create",
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["Reviews"],
            transformResponse: (response) => {
                return response;
            }
        }),

        // Get product reviews
        getProductReviews: builder.query<IReview[], string>({
            query: (productID) => ({
                url: `/reviews?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags: ["Reviews"],
            transformResponse: (response: { data: { reviews: IReview[] } }) => {
                return response.data.reviews;
            }
        }),

        // Get vendor product reviews
        getVendorProductReviews: builder.query<IVendorPreview, string>({
            query: (productID) => ({
                url: `/reviews?productId=${encodeURIComponent(productID)}`,
                method: "GET",
            }),
            providesTags: ["VendorProductPreview"],
            transformResponse: (response: { data: IVendorPreview }) => {
                return response.data;
            },
        }),

        // Like a review
        likeReview: builder.mutation<any, ILikeReview>({
            query: (requestData) => ({
                url: "/review/update/likeReview",
                method: "PUT",
                body: requestData,
            }),
            invalidatesTags: ["Reviews"],
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
            invalidatesTags: ["Reviews"],
            transformResponse: (response) => {
                return response;
            }
        }),
    }),
});

export const { 
    useGetProductReviewsQuery,
    useLazyGetProductReviewsQuery,
    useLazyGetVendorProductReviewsQuery,
    useCreateReviewMutation,
    useLikeReviewMutation,
    useDislikeReviewMutation,
} = reviewAPI;
export default reviewAPI;