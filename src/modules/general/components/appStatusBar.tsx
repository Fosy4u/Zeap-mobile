import React from "react";
import { Platform, StatusBar, StatusBarStyle } from "react-native";

interface Props {
    backgroundColor: string;
    barStyle?: StatusBarStyle;
}

const AppStatusBar: React.FC<Props> = ({ backgroundColor, barStyle = "light-content" }) => (
    <StatusBar
        backgroundColor={ backgroundColor }
        barStyle={ Platform.OS === "android" ? barStyle : "dark-content" }
    />
);

export default AppStatusBar;
