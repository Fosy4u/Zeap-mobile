import { getAuth, getIdToken } from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'auth_token';

/**
 * Prepares authorization headers for API requests
 */
const AuthorizationHeader = async (headers: Headers): Promise<Headers> => {
    try {
        const currentUser = getAuth().currentUser; // ✅ 2.  modular auth instance

        // Get token from current user or stored token
        let token: string;
        if (currentUser) {
            // Get fresh token from Firebase
            token = await getIdToken(currentUser, true); // ✅ 3.  modular auth instance
            // console.log("REFRESHED TOKEN::: ", token);
            
            // Store the token
            await storeToken(token);
        } else {
            // Try to get stored token
            const storedToken = await getToken();
            if (!storedToken) {
                throw new Error('No authentication token available');
            }
            token = storedToken;
        }

        // Set headers
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Accept', 'application/json');
        
        return headers;
    } catch (error) {
        throw new Error('Failed to set authorization headers');
    }
};

/**
 * Store authentication token
 */
const storeToken = async (token: string): Promise<void> => {
    try {
        await EncryptedStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
        throw new Error('Failed to store token');
    }
};

/**
 * Get stored authentication token
 */
const getToken = async (): Promise<string | null> => {
    try {
        const token = await EncryptedStorage.getItem(TOKEN_KEY);
        return token ? JSON.parse(token) : null;
    } catch (error) {
        throw new Error('Failed to get token');
    }
};

/**
 * Clear stored authentication token
 */
const clearToken = async (): Promise<void> => {
    try {
        await EncryptedStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        throw new Error('Failed to clear token');
    }
};

export { storeToken, getToken, clearToken };
export default AuthorizationHeader;