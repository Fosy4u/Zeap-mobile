import { Alert, Linking } from "react-native";

const TRUSTED_WEB_HOSTS = ["zeaper.com", "zeaper-web-dev.vercel.app"];
const SECURE_URL = /^https:\/\/([^/?#\s\\]+)([/?#][^\s]*)?$/i;
const HOST_NAME = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

const getSecureLinkHost = (url?: string | null): string | null => {
    if (!url || typeof url !== "string") return null;

    const match = SECURE_URL.exec(url.trim());
    if (!match) return null;

    const authority = match[1];
    if (authority.includes("@")) return null;

    const host = authority.replace(/:\d{1,5}$/, "").toLowerCase();
    return HOST_NAME.test(host) ? host : null;
};

const isTrustedHost = (host: string) =>
    TRUSTED_WEB_HOSTS.some((trusted) => host === trusted || host.endsWith(`.${ trusted }`));

const isTrustedWebLink = (url?: string | null): boolean => {
    const host = getSecureLinkHost(url);
    return !!host && isTrustedHost(host);
};

const showBlockedLink = () => {
    Alert.alert("Link not supported", "This link can't be opened.");
};

const openSecureLink = (url?: string | null, failedTitle = "Couldn't open link", failedMessage = "Please try again or contact support.") => {
    if (!getSecureLinkHost(url)) {
        showBlockedLink();
        return;
    }

    Linking.openURL(url!.trim()).catch(() => {
        Alert.alert(failedTitle, failedMessage);
    });
};

const openExternalLinkWithConfirm = (url?: string | null) => {
    const host = getSecureLinkHost(url);
    if (!host) {
        showBlockedLink();
        return;
    }

    if (isTrustedHost(host)) {
        openSecureLink(url);
        return;
    }

    Alert.alert(
        "Leaving Zeaper",
        `This link goes to ${ host }. Do you want to open it?`,
        [
            { text: "Cancel", style: "cancel" },
            { text: "Open", onPress: () => openSecureLink(url) },
        ],
    );
};

export { getSecureLinkHost, isTrustedWebLink, openSecureLink, openExternalLinkWithConfirm };
