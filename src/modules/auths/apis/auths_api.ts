import rootAPI from "../../../redux/api/rootAPI.ts";
import { loginUserRoute, mergeUserDataRoute, registerUserRoute } from "../../../redux/api/api_route.ts";
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
    }),
});

export const {
    useRegisterGuestUserMutation,
    useLazyGetUserByIdQuery,
    useMergeUserDataMutation
} = authAPI;
export default authAPI;
