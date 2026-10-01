import EncryptedStorage from "react-native-encrypted-storage";

const forgetSecureItem = async (key: string): Promise<void> => {
    try {
        await EncryptedStorage.removeItem(key);
    } catch {
    }
};

const readSecureItem = async (key: string): Promise<string | null> => {
    try {
        return await EncryptedStorage.getItem(key);
    } catch (error) {
        console.warn(`[secureStorage] read failed for "${key}"; treating as empty.`, error);
        return null;
    }
};

const writeSecureItem = async (key: string, value: string): Promise<boolean> => {
    try {
        await EncryptedStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`[secureStorage] write failed for "${key}".`, error);
        return false;
    }
};

const readSecureJSON = async <T>(key: string): Promise<T | null> => {
    const raw = await readSecureItem(key);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as T;
    } catch (error) {
        console.warn(`[secureStorage] corrupt JSON at "${key}"; discarding.`, error);
        await forgetSecureItem(key);
        return null;
    }
};

export { forgetSecureItem, readSecureItem, writeSecureItem, readSecureJSON };
