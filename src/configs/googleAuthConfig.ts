import { GoogleSignin } from "@react-native-google-signin/google-signin";


/**
 * Google Sign-In Configuration
 */
const googleSignInConfig = {
    webClientId: "241723989064-ekaslh36fm5s7ugvhroc1iod1k30i0f7.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ["profile", "email"],
    iosClientId: "241723989064-op84vg5np5fep24l9rtaa27s46eh8c0n.apps.googleusercontent.com",
};

const googleSignIn = GoogleSignin.configure(googleSignInConfig);
export default googleSignIn;