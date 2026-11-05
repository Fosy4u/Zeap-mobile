/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

const mockComponent = name => {
  const React = require('react');
  const {View} = require('react-native');
  const Component = React.forwardRef((props, ref) => React.createElement(View, {...props, ref, testID: props.testID ?? name}));
  Component.displayName = name;
  return Component;
};

jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  configureReanimatedLogger: jest.fn(),
  ReanimatedLogLevel: {debug: 0, info: 1, warn: 2, error: 3},
}));
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('@gorhom/bottom-sheet', () => require('@gorhom/bottom-sheet/mock'));

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({options: {apiKey: 'test-key'}})),
}));

jest.mock('@react-native-firebase/auth', () => {
  const auth = {currentUser: null};
  return {
    getAuth: jest.fn(() => auth),
    onAuthStateChanged: jest.fn((_auth, callback) => {
      callback(auth.currentUser);
      return jest.fn();
    }),
    getIdToken: jest.fn(async () => 'test-token'),
    signInAnonymously: jest.fn(async () => ({user: {uid: 'guest-uid', isAnonymous: true}})),
    signInWithEmailAndPassword: jest.fn(),
    signInWithCredential: jest.fn(),
    signOut: jest.fn(async () => {}),
    GoogleAuthProvider: {credential: jest.fn(() => ({}))},
  };
});

jest.mock('@react-native-firebase/messaging', () => ({
  AuthorizationStatus: {NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2},
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(async () => 'test-fcm-token'),
  deleteToken: jest.fn(async () => {}),
  getAPNSToken: jest.fn(async () => null),
  getInitialNotification: jest.fn(async () => null),
  isDeviceRegisteredForRemoteMessages: jest.fn(() => true),
  registerDeviceForRemoteMessages: jest.fn(async () => {}),
  requestPermission: jest.fn(async () => 1),
  onMessage: jest.fn(() => jest.fn()),
  onNotificationOpenedApp: jest.fn(() => jest.fn()),
  onTokenRefresh: jest.fn(() => jest.fn()),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(async () => true),
    hasPreviousSignIn: jest.fn(() => false),
    signIn: jest.fn(),
    signOut: jest.fn(async () => {}),
    getTokens: jest.fn(async () => ({})),
  },
  statusCodes: {SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED', IN_PROGRESS: 'IN_PROGRESS'},
}));

jest.mock('react-native-encrypted-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      setItem: jest.fn(async (key, value) => { store.set(key, value); }),
      getItem: jest.fn(async key => (store.has(key) ? store.get(key) : null)),
      removeItem: jest.fn(async key => { store.delete(key); }),
      clear: jest.fn(async () => { store.clear(); }),
    },
  };
});

jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({children}) => children,
  useStripe: () => ({
    handleURLCallback: jest.fn(async () => false),
    initPaymentSheet: jest.fn(async () => ({})),
    presentPaymentSheet: jest.fn(async () => ({})),
  }),
}));

jest.mock('react-native-paystack-webview', () => ({
  PaystackProvider: ({children}) => children,
  usePaystack: () => ({popup: {checkout: jest.fn(), newTransaction: jest.fn()}}),
}));

jest.mock('react-native-push-notification', () => ({
  __esModule: true,
  Importance: {DEFAULT: 3, HIGH: 4, LOW: 2, MIN: 1, NONE: 0, UNSPECIFIED: -1},
  default: {
    configure: jest.fn(),
    createChannel: jest.fn((_channel, callback) => callback?.(true)),
    localNotification: jest.fn(),
    cancelAllLocalNotifications: jest.fn(),
    removeAllDeliveredNotifications: jest.fn(),
    setApplicationIconBadgeNumber: jest.fn(),
  },
}));

jest.mock('@react-native-community/push-notification-ios', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    requestPermissions: jest.fn(async () => ({})),
    getInitialNotification: jest.fn(async () => null),
    FetchResult: {NoData: 'UIBackgroundFetchResultNoData'},
  },
}));

jest.mock('react-native-localize', () => ({
  getCountry: jest.fn(() => 'NG'),
  getLocales: jest.fn(() => [{countryCode: 'NG', languageTag: 'en-NG', languageCode: 'en', isRTL: false}]),
  getCurrencies: jest.fn(() => ['NGN']),
  getTimeZone: jest.fn(() => 'Africa/Lagos'),
}));

jest.mock('react-native-share', () => ({__esModule: true, default: {open: jest.fn(async () => ({}))}}));
jest.mock('@react-native-clipboard/clipboard', () => ({__esModule: true, default: {setString: jest.fn(), getString: jest.fn(async () => '')}}));
jest.mock('react-native-document-picker', () => ({
  __esModule: true,
  default: {pick: jest.fn(async () => []), isCancel: jest.fn(() => false), types: {pdf: 'application/pdf', images: 'image/*'}},
  types: {pdf: 'application/pdf', images: 'image/*'},
}));
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(async () => ({didCancel: true})),
  launchImageLibrary: jest.fn(async () => ({didCancel: true})),
}));

jest.mock('react-native-fast-image', () => {
  const FastImage = mockComponent('FastImage');
  FastImage.resizeMode = {contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center'};
  FastImage.priority = {low: 'low', normal: 'normal', high: 'high'};
  FastImage.preload = jest.fn();
  return {__esModule: true, default: FastImage};
});
jest.mock('react-native-video', () => ({__esModule: true, default: mockComponent('Video')}));
jest.mock('react-native-webview', () => ({WebView: mockComponent('WebView'), default: mockComponent('WebView')}));
jest.mock('react-native-date-picker', () => ({__esModule: true, default: mockComponent('DatePicker')}));
jest.mock('react-native-pell-rich-editor', () => ({
  RichEditor: mockComponent('RichEditor'),
  RichToolbar: mockComponent('RichToolbar'),
  actions: {},
}));
jest.mock('@react-native-community/checkbox', () => ({__esModule: true, default: mockComponent('CheckBox')}));
jest.mock('react-native-linear-gradient', () => ({__esModule: true, default: mockComponent('LinearGradient')}));
jest.mock('react-native-reanimated-carousel', () => ({__esModule: true, default: mockComponent('Carousel')}));
jest.mock('react-native-gifted-charts', () => ({PieChart: mockComponent('PieChart')}));

const {NativeModules, Linking} = require('react-native');
Linking.addEventListener = jest.fn(() => ({remove: jest.fn()}));
Linking.getInitialURL = jest.fn(async () => null);
NativeModules.SensitiveFiles = {
  stage: jest.fn(async uri => uri),
  remove: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
};
