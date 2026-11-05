import { securityEvent } from './securityLogger';
import EncryptedStorage from "./sessionStorage";

const forgetSecureItem = async (key: string): Promise<void> => {
    try {
        await EncryptedStorage.removeItem(key);
    } catch (error: any) {
        if (error?.code === -25300 || error?.code === '-25300' || error?.code === 'RNEncryptedStorageError' && error?.message?.includes('not exist')) return;
        securityEvent('secure_storage_delete_failed');
        throw new Error('Secure session cleanup failed');
    }
};

const readSecureItem = async (key: string): Promise<string | null> => {
    try {
        return await EncryptedStorage.getItem(key);
    } catch (error) {

        return null;
    }
};

const writeSecureItem = async (key: string, value: string): Promise<boolean> => {
    try {
        await EncryptedStorage.setItem(key, value);
        return true;
    } catch (error) {

        return false;
    }
};

const readSecureJSON = async <T>(key: string): Promise<T | null> => {
    const raw = await readSecureItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch (error) {

        await forgetSecureItem(key);
        return null;
    }
};

export { forgetSecureItem, readSecureItem, writeSecureItem, readSecureJSON };
