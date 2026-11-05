import { getAuth, getIdToken, onAuthStateChanged } from '@react-native-firebase/auth';
import { captureSession, isCurrentSession } from './session';
import { forgetSecureItem } from '../../utils/secureStorage';

export const waitForAuthRestore = (): Promise<any> => new Promise(resolve => {
    let unsubscribe: (() => void) | undefined;
    unsubscribe = onAuthStateChanged(getAuth(), user => {
        resolve(user);
        Promise.resolve().then(() => unsubscribe?.());
    });
});
const AuthorizationHeader = async (headers: Headers): Promise<Headers> => {
    const session = captureSession();
    const user = getAuth().currentUser;
    if (!user || !isCurrentSession(session)) throw new Error('Session unavailable');
    const token = await getIdToken(user);
    if (!isCurrentSession(session)) throw new Error('Session changed');
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/json');
    return headers;
};
const storeToken = async (_token: string): Promise<void> => {};
const getToken = async (): Promise<string | null> => {
    const user = getAuth().currentUser;
    return user ? getIdToken(user) : null;
};
const clearToken = () => forgetSecureItem('auth_token');
export { storeToken, getToken, clearToken };
export default AuthorizationHeader;
