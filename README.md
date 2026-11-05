# Zeaper Mobile

The Zeaper fashion marketplace app for iOS and Android, built with React Native 0.74 and TypeScript. Buyers browse and buy ready-to-wear and bespoke fashion; vendors run their shop, products and orders from the same app.

- **API:** `https://zeap-api.onrender.com`. The app and the web app share this backend.
- **Web app (reference behaviour):** https://zeaper-web-dev.vercel.app
- **Auth and push notifications:** Firebase (Auth, Cloud Messaging)
- **Payments:** Paystack (NGN) and Stripe

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | 18 or newer (CI uses 22) |
| npm | 10. This project uses **npm only**; don't use Yarn. |
| Xcode | 15 or newer, with CocoaPods (iOS 15.0 minimum deployment target) |
| Android Studio | With JDK 17 and an Android SDK |

Set up your machine first with React Native's [environment setup guide](https://reactnative.dev/docs/environment-setup).

## Setup

```sh
npm ci
cp .env.example .env
cd ios && pod install && cd ..
```

- `npm ci` installs the exact versions in `package-lock.json`. Its `postinstall` step runs `patch-package`, which applies the fix in `patches/react-native-paystack-webview+5.1.0.patch`.
- `.env` is git-ignored. Ask the team lead for the values. The app reads:
  - `REACT_APP_PAYSTACK_PUBLIC_KEY` and `REACT_APP_STRIPE_PUBLIC_KEY`: **public / publishable** keys (`pk_…`).
  - `REACT_APP_ENCRYPTION_KEY`: the passphrase the backend expects for email sign-up. Without it, email sign-up shows "temporarily unavailable". This is a temporary arrangement until the backend change in `reports/BACKEND_CHANGES.md` (BC1) lands.
- Everything in `.env` is built into the app and can be extracted from it, so never put real secrets there.
- Firebase config files are already in the repository: `ios/ZeapApp/GoogleService-Info.plist` and `android/app/google-services.json`.

## Running the app

```sh
npm start          # start Metro
npm run ios        # build and run on the iOS simulator
npm run android    # build and run on an Android emulator or device
```

## Checks

```sh
npm run typecheck  # TypeScript, no build output
npm test           # Jest test suite
```

The same checks run automatically on GitHub for every push to `master` or `development` and on every pull request (`.github/workflows/ci.yml`). Please keep them passing.

- Shared test setup lives in `jest.setup.js`. It provides stand-ins for phone-only modules such as Firebase, secure storage, push notifications, payments and media.
- `__tests__/App.test.tsx` checks that the whole app renders. The other files cover login, order filtering, product validation, link safety, request time limits and session isolation.

## Release builds

### Android

Release builds are signed with a dedicated release key that is **never** committed. Set these environment variables before building:

```sh
export ZEAP_RELEASE_STORE_FILE=/absolute/path/to/release.keystore
export ZEAP_RELEASE_STORE_PASSWORD=…
export ZEAP_RELEASE_KEY_ALIAS=…
export ZEAP_RELEASE_KEY_PASSWORD=…
npm run build-android
```

The build fails if any variable is missing or if it points at the debug keystore.

### iOS

Archive from `ios/ZeapApp.xcworkspace` in Xcode with the team's distribution certificate. Before submitting, check that the archived app's push entitlement (`aps-environment`) is `production`.

## Project structure

```
App.tsx, index.tsx        App entry; the Redux store and providers are set up in index.tsx
src/modules/<area>/       Features: auths, user, vendor, profile, settings, notifications, …
    apis/                 RTK Query endpoints (injected into src/redux/api/rootAPI.ts)
    hooks/                Screen logic
    screens/, components/, modals/
    slices/, models/, validations/
src/redux/                Store, root API, request and session policies
src/routes/               Navigation stack and route types
src/utils/                Shared helpers (secure storage, safe links, formatting, …)
patches/                  patch-package fixes applied on install
```

Network requests go through `src/redux/api/rootAPI.ts`. Every request is limited to 45 seconds (uploads: 120 seconds), and automatic retries are limited to read-only requests.

## Local reports

Security reviews and web-app issue lists are kept in `reports/`. That folder is git-ignored, so it stays on your machine and is never pushed.
