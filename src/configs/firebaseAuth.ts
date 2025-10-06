import { getAuth, signInAnonymously, getIdToken } from '@react-native-firebase/auth';

const getAnonymousToken = async () => {
  try {
    const { user } = await signInAnonymously(getAuth());
    return await getIdToken(user); // ✅ modular
  } catch (error) {
    console.error('Error generating anonymous token:', error);
    throw error;
  }
};

export default getAnonymousToken;