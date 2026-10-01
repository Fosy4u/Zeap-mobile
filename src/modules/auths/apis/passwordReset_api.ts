import { getApp } from "@react-native-firebase/app";

const SEND_OOB_CODE_URL = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode";

const CLIENT_TYPE = "CLIENT_TYPE_WEB";

const ERROR_MESSAGES: Record<string, string> = {
    EMAIL_NOT_FOUND: "No account found with that email address.",
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

    console.log("[ForgotPassword] POST", SEND_OOB_CODE_URL);
    console.log("[ForgotPassword] Request payload:", JSON.stringify(requestBody, null, 2));

    let response: Response;
    try {
        response = await fetch(`${SEND_OOB_CODE_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });
    } catch (transportError) {
        console.log("[ForgotPassword] Request never reached Firebase:", transportError);
        throw transportError;
    }

    const payload = await response.json().catch(() => null);

    console.log(`[ForgotPassword] Response status: ${response.status} ${response.ok ? "(ok)" : "(failed)"}`);
    console.log("[ForgotPassword] Response payload:", JSON.stringify(payload, null, 2));

    if (!response.ok) {
        const code = payload?.error?.message?.split(" ")[0] ?? "";
        const message = ERROR_MESSAGES[code] ?? "Couldn't send the reset email. Please try again.";
        console.log("[ForgotPassword] Surfacing to user:", message);
        throw new Error(message);
    }
};

export { sendPasswordResetCode };
