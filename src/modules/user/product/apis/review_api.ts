import api from "../../../../redux/api/api";
import IReview from "../models/review_model";
import { ILikeReview, IReviewProduct } from "../validations/review_validation";

const reviewAPI = api.injectEndpoints({
    endpoints: (builder) => ({
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

        dilikeReview: builder.mutation<any, ILikeReview>({
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
    useCreateReviewMutation,
    useLikeReviewMutation,
    useDilikeReviewMutation,
} = reviewAPI;
export default reviewAPI;