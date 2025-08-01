import { GoogleSignin } from "@react-native-google-signin/google-signin";


/**
 * Google Sign-In Configuration
 */
const googleSignInConfig = {
    webClientId: "1021010121212-6q0m9o5m6m7m8m9m0n1n2n3n4n5n6n7n8n9n0.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ["profile", "email"],
    iosClientId: "1021010121212-6q0m9o5m6m7m8m9m0n1n2n3n4n5n6n7n8n9n0.apps.googleusercontent.com",
};

const googleSignIn = GoogleSignin.configure(googleSignInConfig);
export default googleSignIn;