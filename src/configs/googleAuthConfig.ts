import { GoogleSignin } from "@react-native-google-signin/google-signin";

// On iOS the iosClientId is read from GoogleService-Info.plist (CLIENT_ID),
// so we intentionally do not pass it here — passing a mismatched value
// silently breaks the sign-in flow.
GoogleSignin.configure({
    webClientId: "241723989064-ekaslh36fm5s7ugvhroc1iod1k30i0f7.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    scopes: ["profile", "email"],
});