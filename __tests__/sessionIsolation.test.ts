import {it, expect, jest, afterEach} from '@jest/globals';
const mockAuth: {currentUser: {uid: string} | null} = {currentUser: {uid: 'A'}};
const mockDisk = new Map<string, string>();
const mockSetItem = jest.fn(async (key: string, value: string) => {
  mockDisk.set(key, value);
});
const mockRemoveItem = jest.fn(async (key: string) => {
  mockDisk.delete(key);
});
jest.mock('../src/utils/securityLogger', () => ({securityEvent: jest.fn()}));
jest.mock('@react-native-firebase/auth', () => ({getAuth: () => mockAuth}));
jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    setItem: (...args: [string, string]) => mockSetItem(...args),
    removeItem: (key: string) => mockRemoveItem(key),
    getItem: async (key: string) => mockDisk.get(key) ?? null,
  },
}));
import {
  beginSessionEnd,
  captureSession,
  finishSessionEnd,
  isCurrentSession,
  isSessionBlocked,
  setSessionReset,
  syncSession,
} from '../src/redux/services/session';
import storage from '../src/utils/sessionStorage';
import {forgetSecureItem} from '../src/utils/secureStorage';

afterEach(() => {
  finishSessionEnd();
  mockDisk.clear();
  jest.clearAllMocks();
});
it('invalidates work on every identity transition, including A → B → A', () => {
  mockAuth.currentUser = {uid: 'A'};
  const reset = jest.fn();
  setSessionReset(reset);
  const original = captureSession();
  reset.mockClear();
  mockAuth.currentUser = {uid: 'B'};
  syncSession();
  expect(isCurrentSession(original)).toBe(false);
  mockAuth.currentUser = {uid: 'A'};
  syncSession();
  expect(isCurrentSession(original)).toBe(false);
  expect(reset).toHaveBeenCalledTimes(2);
});
it('blocks old authenticated work throughout incomplete logout', () => {
  const session = captureSession();
  beginSessionEnd();
  expect(isSessionBlocked()).toBe(true);
  expect(isCurrentSession(session)).toBe(false);
});
it('removes a late disk write after identity changes', async () => {
  mockAuth.currentUser = {uid: 'A'};
  let release!: () => void;
  let started!: () => void;
  const began = new Promise<void>(resolve => {
    started = resolve;
  });
  mockSetItem.mockImplementationOnce(async (key, value) => {
    started();
    await new Promise<void>(resolve => {
      release = resolve;
    });
    mockDisk.set(key, value);
  });
  const write = storage.setItem('user_data', JSON.stringify({uid: 'A'}));
  await began;
  mockAuth.currentUser = {uid: 'B'};
  syncSession();
  release();
  await expect(write).rejects.toThrow('Session changed');
  expect(mockDisk.has('user_data')).toBe(false);
});
it('rejects foreign profiles and makes deletion failures observable', async () => {
  mockAuth.currentUser = {uid: 'B'};
  await expect(
    storage.setItem('user_data', JSON.stringify({uid: 'A'})),
  ).rejects.toThrow('Profile identity mismatch');
  mockRemoveItem.mockRejectedValueOnce(new Error('storage unavailable'));
  await expect(forgetSecureItem('user_data')).rejects.toThrow(
    'Secure session cleanup failed',
  );
});
