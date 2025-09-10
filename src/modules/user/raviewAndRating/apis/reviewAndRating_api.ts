import rootAPI from "../../../../redux/api/rootAPI";
import { getAllReviewsRoute } from "../../../../redux/api/api_route";
import IReview from "../models/review_model";


const reviewAndRatingAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        // Get all reviews (pending and given)
        getAllReviews: builder.query<IReview, void>({
            query: () => ({
                url: getAllReviewsRoute,
                method: "GET",
            }),
            providesTags: ["Reviews"],
            transformResponse: (response: { data: IReview }) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useLazyGetAllReviewsQuery,
} = reviewAndRatingAPI;

export default reviewAndRatingAPI; 