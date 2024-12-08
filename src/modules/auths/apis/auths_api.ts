import api from "../../../redux/api/api";
import { IUser } from "../../profile/models/profileState_model";
import { IRegisterUser } from "../validations/auths_validation";
import { getSavedAnonymousToken } from "../../../redux/services/authorizationHeader";

const authAPI = api.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        registerUser: builder.mutation<any, IRegisterUser>({
            query: (requestData) => ({
                url: "/user/create",
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ getSavedAnonymousToken() }`
                },
                body: requestData,
            }),
            invalidatesTags: [
                "user"
            ],
            transformResponse: (response: any) => {
                return response;
            },
        }),

        getUserById: builder.query<IUser, string>({
            query: (uid) => ({
                url: `/userByUid?uid=${ uid }`,
                method: "GET",
            }),
            providesTags: [
                "user"
            ],
            transformResponse: (response: { data: IUser }) => {
                return response.data;
            },
        }),

        forgotPassword: builder.mutation<any, any>({
            query: (requestData) => ({
                url: "",
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
    useRegisterUserMutation,
    useLazyGetUserByIdQuery,
    useForgotPasswordMutation
} = authAPI;
export default authAPI;
// SSG9gZI9EnPr37YADpAZfNkPIcn2