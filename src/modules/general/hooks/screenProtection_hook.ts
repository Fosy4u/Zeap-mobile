import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { disableScreenProtection, enableScreenProtection } from "../../../utils/screenProtection";

const useScreenProtection = () => {
    useFocusEffect(
        useCallback(() => {
            enableScreenProtection();
            return () => disableScreenProtection();
        }, [])
    );
};

export default useScreenProtection;
