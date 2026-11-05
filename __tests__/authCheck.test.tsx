import {describe, it, expect, jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockDispatch = jest.fn();
const mockNavigation = {navigate: mockNavigate, goBack: mockGoBack, canGoBack: () => true};
let mockProfile: Record<string, unknown> = {};
const mockAuth: {currentUser: {uid: string; isAnonymous: boolean} | null} = {
  currentUser: null,
};
let mockAuthListener: (user: typeof mockAuth.currentUser) => void;
jest.mock('../src/redux/services/session', () => ({
  isSessionBlocked: () => false,
}));
jest.mock('@react-native-firebase/auth', () => ({
  getAuth: () => mockAuth,
  onAuthStateChanged: (_auth: unknown, callback: typeof mockAuthListener) => {
    mockAuthListener = callback;
    return jest.fn();
  },
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({name: 'ordersScreen'}),
}));
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (select: any) => select({profileState: {userData: mockProfile}}),
}));
jest.mock('../src/modules/auths/slices/authState_slice', () => ({
  setPendingDestination: (payload: unknown) => ({type: 'pending', payload}),
}));
import AuthCheck from '../src/modules/auths/components/authCheck';

it('never mounts protected content for a guest, and unmounts on revocation', () => {
  const mount = jest.fn();
  const unmount = jest.fn();
  const PrivateScreen = () => {
    React.useEffect(() => {
      mount();
      return () => {
        unmount();
      };
    }, []);
    return null;
  };
  const Protected = AuthCheck(PrivateScreen);
  let tree!: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<Protected />);
  });
  act(() => {
    mockAuth.currentUser = {uid: 'guest', isAnonymous: true};
    mockAuthListener(mockAuth.currentUser);
  });
  expect(mount).not.toHaveBeenCalled();
  expect(mockNavigate).toHaveBeenCalledWith('loginInfoScreen');
  act(() => {
    mockAuth.currentUser = {uid: 'A', isAnonymous: false};
    mockAuthListener(mockAuth.currentUser);
  });
  expect(mount).toHaveBeenCalledTimes(1);
  act(() => {
    mockAuth.currentUser = null;
    mockAuthListener(null);
  });
  expect(unmount).toHaveBeenCalledTimes(1);
  act(() => tree.unmount());
});

describe('vendor-only screens', () => {
  const VendorScreen = () => <Text>Bank details</Text>;
  const Protected = AuthCheck(VendorScreen, undefined, 'vendor');
  const textOf = (tree: renderer.ReactTestRenderer) =>
    tree.root.findAllByType(Text).map(node => [].concat(node.props.children).join(''));

  const renderSignedIn = () => {
    let tree!: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<Protected />);
    });
    act(() => {
      mockAuth.currentUser = {uid: 'V1', isAnonymous: false};
      mockAuthListener(mockAuth.currentUser);
    });
    return tree;
  };

  it('shows a loading spinner while the profile is still loading', () => {
    mockProfile = {};
    const tree = renderSignedIn();
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(1);
    expect(textOf(tree)).not.toContain('Bank details');
    act(() => tree.unmount());
  });

  it('explains the screen is for shop owners when the user is not a vendor', () => {
    mockProfile = {uid: 'V1', isVendor: false};
    const tree = renderSignedIn();
    expect(textOf(tree)).toContain('This area is for shop owners only');
    expect(textOf(tree)).not.toContain('Bank details');
    act(() => {
      tree.root.findAllByType(TouchableOpacity).at(-1)!.props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalled();
    act(() => tree.unmount());
  });

  it('shows the screen to a vendor', () => {
    mockProfile = {uid: 'V1', isVendor: true};
    const tree = renderSignedIn();
    expect(textOf(tree)).toContain('Bank details');
    act(() => tree.unmount());
  });
});
