import { useMemo, useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { ImageLibraryOptions, launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../../../../../redux/store/store";
import RootNavigationStackModel from "../../../../../routes/model/routes_model";
import {
    IOnboardingDocumentRequirement,
    useGetOnboardingDocumentsQuery,
    useUploadOnboardingDocumentMutation,
} from "../../apis/general_api";

const MAX_FILE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type DocStatus = "idle" | "selected" | "uploading" | "uploaded" | "failed";

export interface IPickedFile {
    uri: string;
    name: string;
    type: string;
    size?: number;
}

export interface IDocSlotState {
    file?: IPickedFile;
    status: DocStatus;
    errorMessage?: string;
    // Set when the backend already has an uploaded doc on first fetch.
    remoteLink?: string | null;
}

const useVendorDocumentUploadHook = () => {
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    // shop.shopId is populated by the welcome flow; fall back to userData.shopId
    // for resilience (in case the user reopens this screen after a refresh).
    const shopId = shop?.shopId || userData?.shopId || "";

    const {
        data: documents,
        isFetching,
        refetch,
    } = useGetOnboardingDocumentsQuery(shopId, { skip: !shopId });

    const [uploadOnboardingDocument] = useUploadOnboardingDocumentMutation();

    // Keyed by slug. Seeds remoteLink from the API response so docs already
    // uploaded in a prior session show as "uploaded".
    const [slotState, setSlotState] = useState<Record<string, IDocSlotState>>({});

    const docs = useMemo<IOnboardingDocumentRequirement[]>(() => documents ?? [], [documents]);

    // When the API responds, hydrate any slot that has a remote link as
    // "uploaded" so the user sees their existing state.
    useMemo(() => {
        if (!documents) { return; }
        setSlotState((prev) => {
            const next = { ...prev };
            documents.forEach((doc) => {
                if (!next[doc.slug]) {
                    next[doc.slug] = {
                        status: doc.link ? "uploaded" : "idle",
                        remoteLink: doc.link ?? null,
                    };
                }
            });
            return next;
        });
    }, [documents]);

    const uploadedCount = useMemo(
        () => docs.filter((d) => slotState[d.slug]?.status === "uploaded").length,
        [docs, slotState],
    );

    const requestImagePermission = async (): Promise<boolean> => {
        if (Platform.OS !== "android") { return true; }
        try {
            const permission = Platform.Version >= 33
                ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            const has = await PermissionsAndroid.check(permission);
            if (has) { return true; }
            const granted = await PermissionsAndroid.request(permission, {
                title: "Gallery Permission",
                message: "Zeaper needs access to your gallery to upload documents.",
                buttonPositive: "OK",
                buttonNegative: "Cancel",
                buttonNeutral: "Ask Me Later",
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch {
            return false;
        }
    };

    const handlePickFile = async (slug: string) => {
        const hasPermission = await requestImagePermission();
        if (!hasPermission) {
            Alert.alert("Permission required", "Please allow gallery access to choose your document.");
            return;
        }

        const options: ImageLibraryOptions = {
            mediaType: "photo",
            quality: 1,
            includeBase64: false,
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) { return; }
            if (response.errorCode) {
                Alert.alert("Couldn't pick file", response.errorMessage ?? "Please try again.");
                return;
            }

            const asset = response.assets?.[0];
            if (!asset?.uri) { return; }

            const size = asset.fileSize ?? 0;
            const type = asset.type ?? "";

            if (size > MAX_FILE_SIZE_BYTES) {
                Alert.alert("File too large", "Each document must be 1.5 MB or smaller.");
                return;
            }
            if (!ALLOWED_MIME.includes(type)) {
                Alert.alert("Unsupported file", "Use a PNG, JPEG, or WEBP image.");
                return;
            }

            const name = asset.fileName || asset.uri.split("/").pop() || `${ slug }.jpg`;

            setSlotState((prev) => ({
                ...prev,
                [slug]: {
                    ...prev[slug],
                    file: { uri: asset.uri!, name, type, size },
                    status: "selected",
                    errorMessage: undefined,
                },
            }));
        });
    };

    const uploadOne = async (slug: string): Promise<boolean> => {
        const slot = slotState[slug];
        if (!slot?.file) { return false; }

        setSlotState((prev) => ({ ...prev, [slug]: { ...prev[slug], status: "uploading", errorMessage: undefined } }));

        try {
            const formData = new FormData();
            // RN's FormData expects this shape — uri/name/type — for file fields.
            formData.append("file", {
                uri: slot.file.uri,
                name: slot.file.name,
                type: slot.file.type,
            } as any);
            formData.append("shopId", shopId);
            formData.append("slug", slug);

            const result = await uploadOnboardingDocument(formData).unwrap();

            setSlotState((prev) => ({
                ...prev,
                [slug]: {
                    ...prev[slug],
                    status: "uploaded",
                    remoteLink: result?.link ?? prev[slug]?.remoteLink ?? null,
                },
            }));
            return true;
        } catch (err: any) {
            const message = err?.data?.message || err?.errors?.[0] || "Upload failed. Please try again.";
            setSlotState((prev) => ({
                ...prev,
                [slug]: { ...prev[slug], status: "failed", errorMessage: message },
            }));
            return false;
        }
    };

    const handleUploadAll = async () => {
        // Run sequentially so users get clear per-card progress and we don't
        // hammer the backend with parallel multipart streams on cellular.
        for (const doc of docs) {
            const slot = slotState[doc.slug];
            // Skip docs that are already uploaded or have no file selected.
            if (slot?.status === "uploaded") { continue; }
            if (!slot?.file) { continue; }
            await uploadOne(doc.slug);
        }
    };

    const handleFinish = () => {
        // Land on the vendor dashboard regardless of upload completeness —
        // the under-review state is reflected on the dashboard. Users can
        // come back to finish uploads from there (future: add a banner CTA).
        navigation.reset({
            index: 0,
            routes: [{ name: "vendorHomeScreen", params: { screen: "Dashboard" } }],
        });
    };

    return {
        docs,
        slotState,
        uploadedCount,
        totalCount: docs.length,
        isFetching,
        refetch,
        handlePickFile,
        handleUpload: uploadOne,
        handleUploadAll,
        handleFinish,
    };
};

export default useVendorDocumentUploadHook;
