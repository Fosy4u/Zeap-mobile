import rootAPI from "../../../redux/api/rootAPI.ts";
import { getToken } from "../../../redux/services/authorizationHeader.ts";
import { forgotPasswordRoute, loginUserRoute, mergeUserDataRoute, registerUserRoute } from "../../../routes/api/api_route.ts";
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
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ getToken() }`
                },
                body: requestData,
            }),
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
