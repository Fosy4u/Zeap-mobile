import { getAuth, getIdToken, onAuthStateChanged } from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'auth_token';

// On cold start, getAuth().currentUser is null until Firebase finishes restoring
// the persisted session (usually <1s). Wait briefly for it to appear so we don't
// fall back to a stale stored token whose `kid` Firebase has since rotated out.
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

/**
 * Prepares authorization headers for API requests
 */
const AuthorizationHeader = async (headers: Headers): Promise<Headers> => {
    try {
        let currentUser = getAuth().currentUser;
        if (!currentUser) {
            // Wait for Firebase to restore auth state (cold start race).
            currentUser = await waitForAuthRestore(3000);
        }

        let token: string;
        if (currentUser) {
            // Always mint a fresh token — stored tokens go stale fast and
            // Firebase rotates signing keys, invalidating the `kid` claim.
            token = await getIdToken(currentUser, true);
            await storeToken(token);
        } else {
            // No Firebase user even after waiting. The stored token would almost
            // certainly be stale; surface the missing-auth state so the caller
            // can react (splash will sign in anonymously and re-issue).
            throw new Error('No authentication token available');
        }

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