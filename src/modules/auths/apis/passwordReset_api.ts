import { getApp } from "@react-native-firebase/app";

const SEND_OOB_CODE_URL = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode";

const CLIENT_TYPE = "CLIENT_TYPE_WEB";

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL: "That email address isn't valid.",
    MISSING_EMAIL: "Please enter your email address.",
    TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Please try again in a few minutes.",
    RESET_PASSWORD_EXCEED_LIMIT: "Too many reset requests. Please try again later.",
};

const sendPasswordResetCode = async (email: string): Promise<void> => {
    const apiKey = getApp().options.apiKey;
    if (!apiKey) {
        throw new Error("Password reset is unavailable: no Firebase API key configured.");
    }

    const requestBody = {
        requestType: "PASSWORD_RESET",
        email,
        clientType: CLIENT_TYPE,
    };


    let response: Response;
    try {
        response = await fetch(`${SEND_OOB_CODE_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
    } catch (transportError) {

        throw transportError;
    }

    const payload = await response.json().catch(() => null);


    if (!response.ok) {
        const code = payload?.error?.message?.split(" ")[0] ?? "";
        if (code === 'EMAIL_NOT_FOUND') return;
        const message = ERROR_MESSAGES[code] ?? "Couldn't send the reset email. Please try again.";

        throw new Error(message);
    }
};

export { sendPasswordResetCode };
