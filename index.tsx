// index.tsx

// Fix AbortController 'this' binding issue in Hermes/React Native.
// RTK Query detaches the abort() method, losing its prototype context.
if ((global as any).AbortController) {
    const Original = (global as any).AbortController;
    class PatchedAbortController extends Original {
        constructor() {
            super();
            this.abort = this.abort.bind(this);
        }
    }
    (global as any).AbortController = PatchedAbortController;
}

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import App from './App';
import { name as appName } from "./app.json";
import store from './src/redux/store/store';

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
AppRegistry.registerHeadlessTask("StripeKeepJsAwakeTask", () => async () => {
  // No-op task, just prevents the warning
});