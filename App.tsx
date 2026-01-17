import React, { useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

// Import Screens
import AppRoutes from './src/routes/routes';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import useFCMNotificationHook from './src/modules/notifications/hooks/fcm_hook';
import PushNotification from 'react-native-push-notification';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // 👈 disable strict mode
});

const App = (): React.JSX.Element => {

  // Call the FCM hook
  useFCMNotificationHook();

  useEffect(() => {
    // Create channel ONCE at the top (outside the hook)
    PushNotification.createChannel(
      {
        channelId: "default-channel-id",
        channelName: "Default Channel",
        channelDescription: "A default channel",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }, []);

  return (
    // Use StripeProvider here to wrap your app
    <StripeProvider publishableKey={ process.env.REACT_APP_STRIPE_PUBLIC_KEY! }>
      <AppRoutes />
    </StripeProvider>
    
  );
}

export default App;
