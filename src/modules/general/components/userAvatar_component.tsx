import React, { useState } from "react";
import { Image, View } from "react-native";
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

const UserAvatar = (props: IUserAvatarProps) => {
    const {
        photoURL,
        firstName,
        lastName,
        displayName,
        isGuest,
        size = 60,
    } = props;

    const [imageFailed, setImageFailed] = useState(false);

    const showRemoteImage = !isGuest && !!photoURL && !imageFailed;

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
            style={{ height: size, width: size, borderRadius: size / 2, overflow: "hidden", backgroundColor: "#E9E9E7" }}
            accessibilityRole="image"
            accessibilityLabel={displayName || `${firstName ?? ""} ${lastName ?? ""}`.trim() || "User avatar"}
        >
            <Image
                source={require("../../../../assets/images/user_icon.png")}
                style={{ height: size, width: size }}
                resizeMode="cover"
            />
        </View>
    );
};

export default UserAvatar;
