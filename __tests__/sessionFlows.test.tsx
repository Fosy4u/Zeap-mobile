import {describe, it, expect, jest, beforeEach, afterEach} from '@jest/globals';
import React from 'react';
import {Provider} from 'react-redux';
import renderer, {act} from 'react-test-renderer';
import {Alert} from 'react-native';
import {signOut} from '@react-native-firebase/auth';
import {deleteToken} from '@react-native-firebase/messaging';
import store from '../src/redux/store/store';
import {setPendingDestination} from '../src/modules/auths/slices/authState_slice';
import {setUserData} from '../src/modules/profile/slices/profileState_slice';

const mockDispatchNavigation = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as object),
  useNavigation: () => ({dispatch: mockDispatchNavigation, navigate: jest.fn(), reset: jest.fn()}),
}));

import useLogoutHook from '../src/modules/auths/hooks/logout_hook';

describe('session reset', () => {
  it('keeps the screen the user was heading to and clears private data', () => {
    store.dispatch(setUserData({uid: 'user-1', firstName: 'Ada'} as any));
    store.dispatch(setPendingDestination({name: 'checkoutScreen', params: {from: 'cart'}} as any));

    store.dispatch({type: 'session/reset'});

    expect(store.getState().authState.pendingDestination).toEqual({name: 'checkoutScreen', params: {from: 'cart'}});
    expect((store.getState().profileState.userData as any)?.firstName ?? '').not.toBe('Ada');
  });
});

describe('logout', () => {
  let signOutUser: () => Promise<void>;
  const Harness = () => {
    signOutUser = useLogoutHook().signOutUser;
    return null;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await act(async () => {
      renderer.create(
        <Provider store={store}>
          <Harness />
        </Provider>,
      );
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const expectLoggedOut = () => {
    expect(signOut).toHaveBeenCalled();
    expect(mockDispatchNavigation).toHaveBeenCalledWith(
      expect.objectContaining({type: 'RESET', payload: expect.objectContaining({routes: [{name: 'splashScreen'}]})}),
    );
    expect(Alert.alert).not.toHaveBeenCalled();
  };

  it('signs out normally when online', async () => {
    await act(async () => {
      await signOutUser();
    });
    expect(deleteToken).toHaveBeenCalled();
    expectLoggedOut();
  });

  it('still signs out when removing the push token fails (offline)', async () => {
    (deleteToken as jest.Mock).mockRejectedValueOnce(new Error('offline') as never);
    await act(async () => {
      await signOutUser();
    });
    expectLoggedOut();
  });

  it('still signs out when removing the push token hangs', async () => {
    jest.useFakeTimers();
    (deleteToken as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));
    let finished = false;
    const pending = signOutUser().then(() => {
      finished = true;
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000);
    });
    await act(async () => {
      await pending;
    });
    expect(finished).toBe(true);
    expectLoggedOut();
  });
});
