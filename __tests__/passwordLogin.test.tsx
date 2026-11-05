import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import React from 'react';
import {Provider} from 'react-redux';
import renderer, {act} from 'react-test-renderer';
import {Alert} from 'react-native';
import {getAuth, signInWithEmailAndPassword, signOut} from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import store from '../src/redux/store/store';

const mockNavigate = jest.fn();
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as object),
  useNavigation: () => ({navigate: mockNavigate, reset: mockReset}),
}));

const mockGetUserById = jest.fn();
const mockMergeUserData = jest.fn();
jest.mock('../src/modules/auths/apis/auths_api', () => ({
  useLazyGetUserByIdQuery: () => [(uid: string) => ({unwrap: () => mockGetUserById(uid)})],
  useMergeUserDataMutation: () => [(body: unknown) => ({unwrap: () => mockMergeUserData(body)})],
  useRegisterGuestUserMutation: () => [jest.fn()],
}));

import useLoginHook from '../src/modules/auths/hooks/login_hook';

const credentials = {email: 'buyer@example.com', password: 'Secret123'};
let onSubmit: (data: typeof credentials) => Promise<void>;
const Harness = () => {
  onSubmit = useLoginHook().onSubmit as any;
  return null;
};

const signInAs = (uid: string) => {
  (signInWithEmailAndPassword as jest.Mock).mockImplementation(async () => {
    (getAuth() as any).currentUser = {uid, isAnonymous: false, email: credentials.email};
    return {user: (getAuth() as any).currentUser};
  });
};

const storedGuestUid = async () => EncryptedStorage.getItem('guest_uid');

describe('password login', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (getAuth() as any).currentUser = {uid: 'guest-1', isAnonymous: true};
    await EncryptedStorage.clear();
    await EncryptedStorage.setItem('guest_uid', JSON.stringify('guest-1'));
    await act(async () => {
      renderer.create(
        <Provider store={store}>
          <Harness />
        </Provider>,
      );
    });
  });

  it('merges the guest session into the account and signs in', async () => {
    signInAs('user-1');
    mockGetUserById.mockResolvedValue({uid: 'user-1', firstName: 'Ada'} as never);
    mockMergeUserData.mockResolvedValue({uid: 'user-1', firstName: 'Ada', cartCount: 2} as never);

    await act(async () => {
      await onSubmit(credentials);
    });

    expect(mockMergeUserData).toHaveBeenCalledWith({guestUid: 'guest-1'});
    expect(store.getState().profileState.userData).toMatchObject({uid: 'user-1', cartCount: 2});
    expect(mockNavigate).toHaveBeenCalledWith('homeScreen', {screen: 'Home'});
    expect(await storedGuestUid()).toBeNull();
  });

  it('still completes login when the guest merge fails', async () => {
    signInAs('user-1');
    mockGetUserById.mockResolvedValue({uid: 'user-1', firstName: 'Ada'} as never);
    mockMergeUserData.mockRejectedValue({status: 500, data: {message: 'Merge failed'}} as never);

    await act(async () => {
      await onSubmit(credentials);
    });

    expect(store.getState().profileState.userData).toMatchObject({uid: 'user-1', firstName: 'Ada'});
    expect(mockNavigate).toHaveBeenCalledWith('homeScreen', {screen: 'Home'});
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(signOut).not.toHaveBeenCalled();
    expect(await storedGuestUid()).toBeNull();
  });

  it('ignores a merge result that belongs to a different account', async () => {
    signInAs('user-1');
    mockGetUserById.mockResolvedValue({uid: 'user-1', firstName: 'Ada'} as never);
    mockMergeUserData.mockResolvedValue({uid: 'someone-else', firstName: 'Eve'} as never);

    await act(async () => {
      await onSubmit(credentials);
    });

    expect(store.getState().profileState.userData).toMatchObject({uid: 'user-1', firstName: 'Ada'});
  });

  it('stays on the login screen when the password is wrong', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({code: 'auth/wrong-password'} as never);

    await act(async () => {
      await onSubmit(credentials);
    });

    expect(mockGetUserById).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalled();
    expect(await storedGuestUid()).toBe(JSON.stringify('guest-1'));
  });

  it('signs back out and restarts the guest session when the profile cannot load', async () => {
    signInAs('user-1');
    mockGetUserById.mockRejectedValue({status: 503} as never);

    await act(async () => {
      await onSubmit(credentials);
    });

    expect(signOut).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({index: 0, routes: [{name: 'splashScreen'}]});
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
