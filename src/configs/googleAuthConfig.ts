import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
    webClientId: "241723989064-ekaslh36fm5s7ugvhroc1iod1k30i0f7.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    scopes: ["profile", "email"],
});