/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import messaging from "@react-native-firebase/messaging";
import store from './src/redux/store/store';


// Register background handler as early as possible
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  
  // You can perform background processing here
  // For example:
  // - Update local storage
  // - Sync with API
  // - Show local notification
  // - Update app badge
  
  // Note: Don't use Alert or any UI components here as the app might be in background
});

// Handle notification when app is killed and opened by notification
messaging().getInitialNotification().then((remoteMessage) => {
  if (remoteMessage) {
    console.log('App opened by notification (killed state):', remoteMessage);
    // You can store this information to handle it when the app is ready
    // or pass it to your navigation system
  }
});

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
AppRegistry.registerHeadlessTask("StripeKeepJsAwakeTask", () => async () => {
  // No-op task, just prevents the warning
});
