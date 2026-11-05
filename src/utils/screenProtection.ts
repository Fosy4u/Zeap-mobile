import { NativeModules } from "react-native";

const native = () => NativeModules.ScreenProtection as { enable?: () => void; disable?: () => void } | undefined;

const enableScreenProtection = () => {
    native()?.enable?.();
};

const disableScreenProtection = () => {
    native()?.disable?.();
};

export { enableScreenProtection, disableScreenProtection };
