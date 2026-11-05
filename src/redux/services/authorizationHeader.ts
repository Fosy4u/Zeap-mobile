import { getAuth, getIdToken, onAuthStateChanged } from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import { forgetSecureItem } from '../../utils/secureStorage';

const TOKEN_KEY = 'auth_token';
let lastStoredToken: string | null = null;

const waitForAuthRestore = (timeoutMs: number): Promise<any> => {
    const auth = getAuth();
    if (auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise((resolve) => {
        let settled = false;
        const finish = (value: any) => {
            if (settled) return;
            settled = true;
            try { unsubscribe(); } catch {}
            clearTimeout(timer);
            resolve(value);
        };
        const unsubscribe = onAuthStateChanged(auth, (user: any) => finish(user ?? null));
        const timer = setTimeout(() => finish(null), timeoutMs);
    });
};

const AuthorizationHeader = async (headers: Headers): Promise<Headers> => {
    try {
        let currentUser = getAuth().currentUser;
        if (!currentUser) {
            currentUser = await waitForAuthRestore(3000);
        }

        let token: string;
        if (currentUser) {
            token = await getIdToken(currentUser);

            if (token !== lastStoredToken) {
                lastStoredToken = token;
                storeToken(token).catch(() => {});
            }
        } else {
            throw new Error('No authentication token available');
        }

        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Accept', 'application/json');

        return headers;
    } catch (error) {
        throw new Error('Failed to set authorization headers');
    }
};

const storeToken = async (token: string): Promise<void> => {
    try {
        await EncryptedStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
        throw new Error('Failed to store token');
    }
};

const getToken = async (): Promise<string | null> => {
    try {
        const token = await EncryptedStorage.getItem(TOKEN_KEY);
        return token ? JSON.parse(token) : null;
    } catch (error) {
        throw new Error('Failed to get token');
    }
};

const clearToken = async (): Promise<void> => {
    lastStoredToken = null;
    await forgetSecureItem(TOKEN_KEY);
};

export { storeToken, getToken, clearToken };
export default AuthorizationHeader;