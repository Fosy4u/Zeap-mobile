import rootAPI from "../../../redux/api/rootAPI";
import ICurrencyUpdate from "../models/currencyUpdate_model";
import IEmailUpdate from "../models/emailUpdate_model";
import { IUser } from "../models/profileState_model";
import IProfileUpdate from "../models/profileUpdate_model";


const profileAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Update User Details
        updateUserDetails: builder.mutation<IUser, IEmailUpdate | ICurrencyUpdate | IProfileUpdate>({
            query: (requestData) => ({
                url: `/user/update?_id=${requestData._id}`, 
                method: "PUT", 
                body: requestData,
            }),
            invalidatesTags: ["user"],
            transformResponse: (response: { data: IUser }) => {
                return response.data;
            },
        }),

        updateUserProfilePic: builder.mutation<IUser, FormData>({
            query: (formData) => ({
                url: "/user/update/profilePic",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["user"],
            transformResponse: (response: { data: IUser }) => response.data,
        }),

        deleteUserAccount: builder.mutation<unknown, { _id: string; uid: string }>({
            query: (requestData) => ({
                url: "/user/delete",
                method: "PUT",
                body: requestData,
            }),
        }),
    }),
});

export const {
    useUpdateUserDetailsMutation,
    useUpdateUserProfilePicMutation,
    useDeleteUserAccountMutation,
} = profileAPI;
export default profileAPI;
