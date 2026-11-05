import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import React from 'react';
import {Provider} from 'react-redux';
import renderer, {act} from 'react-test-renderer';
import {Alert} from 'react-native';
import store from '../src/redux/store/store';
import {setUserData} from '../src/modules/profile/slices/profileState_slice';

const mockDeleteUserAccount = jest.fn();
jest.mock('../src/modules/profile/apis/profile_api', () => ({
  useDeleteUserAccountMutation: () => [(body: unknown) => ({unwrap: () => mockDeleteUserAccount(body)})],
}));

const mockSignOutUser = jest.fn(async () => {});
jest.mock('../src/modules/auths/hooks/logout_hook', () => ({
  __esModule: true,
  default: () => ({signOutUser: mockSignOutUser}),
}));

import useDeleteAccountHook from '../src/modules/settings/hooks/deleteAccount_hook';

let hook: ReturnType<typeof useDeleteAccountHook>;
const Harness = () => {
  hook = useDeleteAccountHook();
  return null;
};

const typeEmail = (value: string) => {
  act(() => {
    hook.setConfirmEmail(value);
  });
};

const pressFinalButton = async (label: 'Delete' | 'Cancel') => {
  const buttons = (Alert.alert as jest.Mock).mock.calls.at(-1)?.[2] as any[];
  await act(async () => {
    await buttons.find(button => button.text === label)?.onPress?.();
  });
};

describe('delete account', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await act(async () => {
      store.dispatch(setUserData({_id: 'mongo-1', uid: 'firebase-1', email: 'Buyer@Example.com'} as any));
      renderer.create(
        <Provider store={store}>
          <Harness />
        </Provider>,
      );
    });
  });

  it('shows the account email the user must type', () => {
    expect(hook.accountEmail).toBe('buyer@example.com');
    expect(hook.isEmailMatched).toBe(false);
  });

  it('does nothing when the typed email does not match', () => {
    typeEmail('someone@else.com');
    expect(hook.isEmailMatched).toBe(false);
    expect(hook.showEmailMismatch).toBe(true);

    act(() => {
      hook.confirmDeleteAccount();
    });
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(mockDeleteUserAccount).not.toHaveBeenCalled();
  });

  it('does not delete when the final warning is cancelled', async () => {
    typeEmail('  buyer@example.COM ');
    expect(hook.isEmailMatched).toBe(true);

    act(() => {
      hook.confirmDeleteAccount();
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete your account?',
      "This will permanently delete your Zeaper account. You can't undo this.",
      expect.any(Array),
    );
    await pressFinalButton('Cancel');
    expect(mockDeleteUserAccount).not.toHaveBeenCalled();
  });

  it('deletes the account with PUT user/delete data and signs out after confirmation', async () => {
    mockDeleteUserAccount.mockResolvedValue({} as never);
    typeEmail('buyer@example.com');

    act(() => {
      hook.confirmDeleteAccount();
    });
    await pressFinalButton('Delete');

    expect(mockDeleteUserAccount).toHaveBeenCalledWith({_id: 'mongo-1', uid: 'firebase-1'});
    expect(mockSignOutUser).toHaveBeenCalled();
  });

  it('keeps the user signed in and shows the error when deletion fails', async () => {
    mockDeleteUserAccount.mockRejectedValue({status: 403, data: {message: 'Not allowed'}} as never);
    typeEmail('buyer@example.com');

    act(() => {
      hook.confirmDeleteAccount();
    });
    await pressFinalButton('Delete');

    expect(mockSignOutUser).not.toHaveBeenCalled();
    expect(hook.isDeleting).toBe(false);
    expect((Alert.alert as jest.Mock).mock.calls.some(call => String(call[1] ?? call[0]).includes('Not allowed'))).toBe(true);
  });
});
