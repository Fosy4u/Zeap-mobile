import {NativeModules} from 'react-native';
import {securityEvent} from './securityLogger';
const native = () => {
  if (!NativeModules.SensitiveFiles)
    throw new Error('Document storage unavailable; rebuild the app');
  return NativeModules.SensitiveFiles;
};
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T>(work: () => Promise<T>): Promise<T> => {
  const result = queue.catch(() => {}).then(work);
  queue = result;
  return result;
};
export const stageSensitiveFile = (uri: string): Promise<string> =>
  enqueue(() => native().stage(uri));
export const removeSensitiveFile = (uri: string): Promise<void> =>
  enqueue(() => native().remove(uri));
export const clearSensitiveFiles = (): Promise<void> =>
  enqueue(() => native().clear());
export const cleanupSensitiveFiles = () => {
  void clearSensitiveFiles().catch(() =>
    securityEvent('document_cleanup_failed'),
  );
};
