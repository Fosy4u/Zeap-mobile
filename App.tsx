import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';

// Import Screens
import AppRoutes from './src/routes/routes';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // 👈 disable strict mode
});

const App = (): React.JSX.Element => {
  return (
    // Use StripeProvider here to wrap your app
    <StripeProvider
      publishableKey={ process.env.REACT_APP_STRIPE_PUBLIC_KEY! }
      // merchantIdentifier='merchant.com.yourapp' // required for Apple Pay
      // urlScheme='your-url-scheme' // required for 3D Secure and bank redirects
    >
      <AppRoutes />
    </StripeProvider>
    
  );
}

export default App;
