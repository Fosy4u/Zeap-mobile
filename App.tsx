import {
  getSessionIdentity,
  isSessionBlocked,
  subscribeSession,
} from './src/redux/services/session';
import React, {useCallback, useEffect, useSyncExternalStore} from 'react';
import {Appearance, Linking, View, Text, ActivityIndicator} from 'react-native';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaystackProvider} from 'react-native-paystack-webview';

// Import Screens
import AppRoutes from './src/routes/routes';
import AppToast from './src/modules/general/components/appToast_component';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import useFCMNotificationHook from './src/modules/notifications/hooks/fcm_hook';
import './src/configs/googleAuthConfig';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // 👈 disable strict mode
});

Appearance.setColorScheme('light');

const STRIPE_URL_SCHEME = 'zeaper';

const StripeDeepLinkHandler = () => {
  const {handleURLCallback} = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        await handleURLCallback(url);
      }
    },
    [handleURLCallback],
  );

  useEffect(() => {
    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener('url', event => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, [handleDeepLink]);

  return null;
};

const App = (): React.JSX.Element => {
  // Call the FCM hook
  useFCMNotificationHook();

  const blocked = useSyncExternalStore(subscribeSession, isSessionBlocked);
  const sessionIdentity = useSyncExternalStore(
    subscribeSession,
    getSessionIdentity,
  );
  if (blocked)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        <Text>Finishing sign out…</Text>
      </View>
    );
  return (
    <SafeAreaProvider>
      <StripeProvider
        publishableKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY!}
        urlScheme={STRIPE_URL_SCHEME}>
        <StripeDeepLinkHandler />
        <PaystackProvider
          publicKey={process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ?? ''}
          currency="NGN"
          defaultChannels={['card', 'bank_transfer', 'bank', 'ussd']}
          debug={__DEV__}>
          <AppRoutes key={sessionIdentity} />
          <AppToast />
        </PaystackProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
};

export default App;
