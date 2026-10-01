import React, { useState } from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";

interface IUserAvatarProps {
    photoURL?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    email?: string | null;
    isGuest?: boolean;
    size?: number;
    seed?: string;
}

// Tailwind-friendly palette. Picked for legible white text on each colour.
const AVATAR_COLORS = [
    "#133522", // baseGreen
    "#1F6B3F",
    "#2563EB",
    "#9333EA",
    "#DB2777",
    "#DC2626",
    "#EA580C",
    "#CA8A04",
    "#0891B2",
    "#475569",
];

const hashString = (input: string): number => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const pickColor = (seed: string): string => {
    if (!seed) return AVATAR_COLORS[0];
    return AVATAR_COLORS[hashString(seed) % AVATAR_COLORS.length];
};

const buildInitials = (
    firstName?: string | null,
    lastName?: string | null,
    displayName?: string | null,
    email?: string | null,
    isGuest?: boolean,
): string => {
    // Guests always render as "G" — backend may seed firstName="Customer" /
    // lastName="Guest" on the guest record, but we want a single, recognisable
    // initial for the unauthenticated state regardless of those values.
    if (isGuest) return "G";

    const first = (firstName || "").trim();
    const last = (lastName || "").trim();
    if (first || last) {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "?";
    }

    const cleanedDisplay = (displayName || "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
    if (cleanedDisplay) {
        const parts = cleanedDisplay.split(/\s+/).filter(Boolean);
        const a = parts[0]?.charAt(0) || "";
        const b = parts[1]?.charAt(0) || "";
        return `${a}${b}`.toUpperCase() || "?";
    }

    const local = (email || "").split("@")[0]?.trim();
    if (local) return local.charAt(0).toUpperCase();

    return "?";
};

const UserAvatar = (props: IUserAvatarProps) => {
    const {
        photoURL,
        firstName,
        lastName,
        displayName,
        email,
        isGuest,
        size = 60,
        seed,
    } = props;

    const [imageFailed, setImageFailed] = useState(false);

    const showRemoteImage = !isGuest && !!photoURL && !imageFailed;
    const initials = buildInitials(firstName, lastName, displayName, email, isGuest);
    const bgColor = pickColor(seed || email || displayName || initials);

    const containerStyle = {
        height: size,
        width: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
    } as const;

    if (showRemoteImage) {
        return (
            <FastImage
                style={{ height: size, width: size, borderRadius: size / 2 }}
                source={{ uri: photoURL!, priority: FastImage.priority.normal }}
                resizeMode={FastImage.resizeMode.cover}
                onError={() => setImageFailed(true)}
            />
        );
    }

    return (
        <View
            style={containerStyle}
            className="items-center justify-center"
            accessibilityRole="image"
            accessibilityLabel={displayName || `${firstName ?? ""} ${lastName ?? ""}`.trim() || "User avatar"}
        >
            <Text style={{ color: "#FFFFFF", fontSize: size * 0.4, fontWeight: "600" }}>
                {initials}
            </Text>
        </View>
    );
};

export default UserAvatar;
