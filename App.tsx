import React, {useCallback, useEffect} from 'react';
import {Appearance, Linking} from 'react-native';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';

// Import Screens
import AppRoutes from './src/routes/routes';
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

/* The app has a light-only design (no dark theme), so we force the light color
   scheme at the JS layer. This keeps RN default components (e.g. TextInput text
   color) readable even on devices set to dark mode, matching the native
   light-mode lock in Info.plist and styles.xml. */
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

  return (
    // Use StripeProvider here to wrap your app
    <StripeProvider
      publishableKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY!}
      urlScheme={STRIPE_URL_SCHEME}>
      <StripeDeepLinkHandler />
      <AppRoutes />
    </StripeProvider>
  );
};

export default App;
