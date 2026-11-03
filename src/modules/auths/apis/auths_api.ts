import rootAPI from "../../../redux/api/rootAPI.ts";
import { checkUserEmailRoute, convertGuestToPasswordUserRoute, loginUserRoute, mergeUserDataRoute, registerUserRoute } from "../../../redux/api/api_route.ts";
import { IUser } from "../../profile/models/profileState_model";

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

        // Look up whether an email already belongs to a registered account
        checkUserEmail: builder.query<any, string>({
            query: (email) => ({
                url: checkUserEmailRoute,
                method: "GET",
                params: { email },
            }),
            extraOptions: { maxRetries: 0 },
            transformResponse: (response: { data: any }) => response.data,
        }),

        // Turn the current guest into an email/password account (same call as the web sign-up)
        convertGuestToPasswordUser: builder.mutation<IUser, { email: string; password: string; firstName: string; lastName: string; phoneNumber: string }>({
            query: (requestData) => ({
                url: convertGuestToPasswordUserRoute,
                method: "PUT",
                body: requestData,
            }),
            extraOptions: { maxRetries: 0 },
            invalidatesTags: ["user"],
            transformResponse: (response: { data: IUser }) => response.data,
        }),
    }),
});

export const {
    useRegisterGuestUserMutation,
    useLazyGetUserByIdQuery,
    useMergeUserDataMutation,
    useLazyCheckUserEmailQuery,
    useConvertGuestToPasswordUserMutation,
} = authAPI;
export default authAPI;
