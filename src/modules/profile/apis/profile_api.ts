import rootAPI from "../../../redux/api/rootAPI";
import ICurrencyUpdate from "../models/currencyUpdate_model";
import IEmailUpdate from "../models/emailUpdate_model";
import { IUser } from "../models/profileState_model";


const profileAPI = rootAPI.injectEndpoints({
    endpoints: (builder) => ({

        // Update User Details
        updateUserDetails: builder.mutation<IUser, IEmailUpdate | ICurrencyUpdate>({
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
    }),
});

export const {
    useUpdateUserDetailsMutation,
} = profileAPI;
export default profileAPI;
