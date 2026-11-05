import {getAuth} from '@react-native-firebase/auth';

let revision = 0;
let uid: string | null | undefined;
let blocked = false;
const listeners = new Set<() => void>();
let reset: () => void = () => {};
let lastChangedAt = 0;
const SESSION_SETTLE_MS = 3000;
export const subscribeSession = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const isSessionBlocked = () => blocked;
export const setSessionReset = (callback: () => void) => {
  reset = callback;
};
export const isSessionSettling = () =>
  blocked || Date.now() - lastChangedAt < SESSION_SETTLE_MS;
const invalidate = () => {
  revision++;
  lastChangedAt = Date.now();
  reset();
  listeners.forEach(listener => listener());
};
export const syncSession = () => {
  const next = getAuth().currentUser?.uid ?? null;
  if (next !== uid) {
    uid = next;
    invalidate();
  }
  return revision;
};
export const beginSessionEnd = () => {
  blocked = true;
  invalidate();
};
export const finishSessionEnd = () => {
  blocked = false;
  syncSession();
  listeners.forEach(listener => listener());
};
export const captureSession = () => ({
  revision: syncSession(),
  uid: getAuth().currentUser?.uid,
});
export const isCurrentSession = (session: ReturnType<typeof captureSession>) =>
  !blocked &&
  session.revision === syncSession() &&
  session.uid === getAuth().currentUser?.uid;

export const getSessionIdentity = () => uid ?? 'restoring';
