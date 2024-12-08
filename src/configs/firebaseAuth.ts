import { getAuth, signInAnonymously } from "@react-native-firebase/auth";

const getAnonymousToken = async () => {
    const auth = getAuth();
    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
        const token = await user.getIdToken();
        return token;
    } catch (error) {
        console.error("Error generating anonymous token:", error);
        throw error;
    }
};

export default getAnonymousToken;