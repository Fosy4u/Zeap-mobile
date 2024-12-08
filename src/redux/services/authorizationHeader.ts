import EncryptedStorage from 'react-native-encrypted-storage';
import { getAuth } from '@react-native-firebase/auth';

/**
 * To get the Firebase token or the refreshed token and return the headers.
 * @param headers 
 * @returns headers - Authorization headers
 */
const AuthorizationHeader = async (headers: Headers) => {

    try {
        let token;
        
        /**
         * Get the Firebase Auth instance.
         * @returns The Auth instance
         */
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            token = await currentUser.getIdToken(true);
            // console.log("REFRESHED TOKEN::: ", token);
        } else {
            throw new Error("User not logged in.");
        }

        // Add token to headers
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");

        return headers;
    } catch (error) {
        console.error("Error::: ", error);
    }
};

const getSavedAnonymousToken =  async() => {
    const token = await EncryptedStorage.getItem("anonymousToken");

    if (token) {
        return token;;
    }
};

export { getSavedAnonymousToken };
export default AuthorizationHeader;