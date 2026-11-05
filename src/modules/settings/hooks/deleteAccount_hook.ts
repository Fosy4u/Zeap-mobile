import { useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { getAuth } from "@react-native-firebase/auth";
import { RootState } from "../../../redux/store/store";
import { useDeleteUserAccountMutation } from "../../profile/apis/profile_api";
import useLogoutHook from "../../auths/hooks/logout_hook";
import handleError from "../../general/hooks/errorHandler_hook";
import showToast from "../../../utils/showToast";

const normalizeEmail = (value?: string | null) => (value ?? "").trim().toLowerCase();

const useDeleteAccountHook = () => {
    const { userData } = useSelector((state: RootState) => state.profileState);
    const [deleteUserAccount] = useDeleteUserAccountMutation();
    const { signOutUser } = useLogoutHook();

    const [confirmEmail, setConfirmEmail] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const accountEmail = normalizeEmail(userData?.email || getAuth().currentUser?.email);
    const isEmailMatched = !!accountEmail && normalizeEmail(confirmEmail) === accountEmail;
    const showEmailMismatch = confirmEmail.trim().length > 0 && !isEmailMatched;

    const handleDeleteAccount = async () => {
        const userId = userData?._id;
        const uid = userData?.uid || getAuth().currentUser?.uid;
        if (!isEmailMatched || isDeleting) { return; }
        if (!userId || !uid) {
            handleError(new Error("We couldn't find your account details. Please log in again and retry."));
            return;
        }

        setIsDeleting(true);
        try {
            await deleteUserAccount({ _id: userId, uid }).unwrap();
            showToast("Your account has been deleted.");
            await signOutUser();
        } catch (error) {
            setIsDeleting(false);
            handleError(error);
        }
    };

    const confirmDeleteAccount = () => {
        if (!isEmailMatched || isDeleting) { return; }

        Alert.alert(
            "Delete your account?",
            "This will permanently delete your Zeaper account. You can't undo this.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => { void handleDeleteAccount(); } },
            ],
        );
    };

    return {
        accountEmail,
        confirmEmail,
        setConfirmEmail,
        isEmailMatched,
        showEmailMismatch,
        isDeleting,
        confirmDeleteAccount,
    };
};

export default useDeleteAccountHook;
