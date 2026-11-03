import rootAPI from "../../../redux/api/rootAPI";
import {
    getHelpArticleRoute,
    getHelpArticlesRoute,
    getPopularHelpArticlesRoute,
    markHelpArticleHelpfulRoute,
} from "../../../redux/api/api_route";
import IHelpArticle from "../models/helpArticle_model";

const helpAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Articles for a category / sub-category
        getHelpArticles: builder.query<IHelpArticle[], { category: string; subCategory: string }>({
            query: ({ category, subCategory }) => ({
                url: getHelpArticlesRoute,
                method: "GET",
                params: { category, subCategory },
            }),
            providesTags: ["Help"],
            transformResponse: (response: { data: IHelpArticle[] }) => response.data ?? [],
        }),

        // Popular articles for a category
        getPopularHelpArticles: builder.query<IHelpArticle[], { category: string }>({
            query: ({ category }) => ({
                url: getPopularHelpArticlesRoute,
                method: "GET",
                params: { category },
            }),
            providesTags: ["Help"],
            transformResponse: (response: { data: IHelpArticle[] }) => response.data ?? [],
        }),

        // A single article
        getHelpArticle: builder.query<IHelpArticle, { articleId: string }>({
            query: ({ articleId }) => ({
                url: getHelpArticleRoute,
                method: "GET",
                params: { articleId },
            }),
            providesTags: ["Help"],
            transformResponse: (response: { data: IHelpArticle }) => response.data,
        }),

        markHelpArticleHelpful: builder.mutation<unknown, { articleId: string; isHelpful: string }>({
            query: ({ articleId, isHelpful }) => ({
                url: markHelpArticleHelpfulRoute,
                method: "PUT",
                body: { articleId, isHelpful },
            }),
            invalidatesTags: ["Help"],
        }),

    }),
});

export const {
    useGetHelpArticlesQuery,
    useGetPopularHelpArticlesQuery,
    useGetHelpArticleQuery,
    useMarkHelpArticleHelpfulMutation,
} = helpAPI;

export default helpAPI;
