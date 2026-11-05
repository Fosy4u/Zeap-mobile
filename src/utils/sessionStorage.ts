import EncryptedStorage from 'react-native-encrypted-storage';
import {captureSession, isCurrentSession} from '../redux/services/session';

let queue: Promise<unknown> = Promise.resolve();
const privateKeys = new Set([
  'user_data',
  'fb_user',
  'user_id',
  'guest_uid',
  'auth_token',
]);
const setItem = (key: string, value: string): Promise<void> => {
  const session = captureSession();
  const work = queue
    .catch(() => {})
    .then(async () => {
      if (privateKeys.has(key)) {
        if (!isCurrentSession(session)) throw new Error('Session changed');
        const parsed = JSON.parse(value);
        const owner =
          key === 'user_data' || key === 'fb_user'
            ? parsed?.uid
            : key === 'user_id'
            ? parsed
            : null;
        if (owner && owner !== session.uid)
          throw new Error('Profile identity mismatch');
      }
      await EncryptedStorage.setItem(key, value);
      if (privateKeys.has(key) && !isCurrentSession(session)) {
        await EncryptedStorage.removeItem(key);
        throw new Error('Session changed');
      }
    });
  queue = work;
  return work;
};
const removeItem = (key: string): Promise<void> => {
  const work = queue
    .catch(() => {})
    .then(() => EncryptedStorage.removeItem(key));
  queue = work;
  return work;
};
export default {
  ...EncryptedStorage,
  getItem: (key: string) => EncryptedStorage.getItem(key),
  setItem,
  removeItem,
};
