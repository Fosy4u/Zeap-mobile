import rootAPI from "../../../redux/api/rootAPI.ts";
import { forgotPasswordRoute, loginUserRoute, mergeUserDataRoute, registerUserRoute } from "../../../redux/api/api_route.ts";
import { IUser } from "../../profile/models/profileState_model";

/**
 * The authAPI
 * @returns
 */
const authAPI = rootAPI.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // Register Guest User
        registerGuestUser: builder.mutation<any, any>({
            query: (requestData) => ({
                url: registerUserRoute,
                method: "PUT",
                body: requestData,
            }),
            // Authorization is handled by prepareHeaders. A missing/invalid Firebase
            // user is not a transient failure, so don't retry — it just stalls the UI.
            extraOptions: { maxRetries: 0 },
            invalidatesTags: ["user"],
            transformResponse: (response: { data: any }) => {
                return response.data;
            },
        }),

        // Get User By ID
        getUserById: builder.query<IUser, string>({
            query: (uid) => ({
                url: loginUserRoute,
                method: "GET",
                params: { uid },
            }),
            // A 404 here means "no profile yet" (first sign-in) — the caller falls back
            // to creating the user. Retrying 3× wastes ~30s before the fallback runs.
            extraOptions: { maxRetries: 0 },
            providesTags: ["user"],
            transformResponse: (response: { data: IUser }) => {
                return response.data;
            },
        }),

        // Merge User Data
        mergeUserData: builder.mutation<IUser, { guestUid: string }>({
            query: (requestData) => ({
                url: mergeUserDataRoute,
                method: "PUT",
                body: requestData
            }),
            invalidatesTags: ["user"],
            transformResponse: (response: { data: IUser }) => {
                return response.data;
            },
        }),

        // Forgot Password
        forgotPassword: builder.mutation<any, any>({
            query: (requestData) => ({
                url: forgotPasswordRoute,
                method: "POST",
                body: requestData
            }),
            transformResponse: (response: any) => {
                return response;
            },
        }),
    }),
});

export const {
    useRegisterGuestUserMutation,
    useLazyGetUserByIdQuery,
    useMergeUserDataMutation,
    useForgotPasswordMutation
} = authAPI;
export default authAPI;
