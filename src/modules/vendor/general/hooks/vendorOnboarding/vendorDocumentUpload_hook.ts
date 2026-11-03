import { useMemo, useState } from "react";
import { ActionSheetIOS, Alert, PermissionsAndroid, Platform } from "react-native";
import DocumentPicker, { types as DocumentPickerTypes } from "react-native-document-picker";
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from "react-native-image-picker";
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

const MAX_FILE_SIZE_BYTES = 1.5 * 1024 * 1024;
const ALLOWED_MIME = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
    "application/pdf",
];

const IMAGE_PICKER_OPTIONS: ImageLibraryOptions = {
    mediaType: "photo",
    quality: 0.8,
    maxWidth: 1600,
    maxHeight: 1600,
    includeBase64: false,
    selectionLimit: 1,
};

const mimeFromName = (value: string): string => {
    const extension = value.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
    switch (extension) {
        case "png": return "image/png";
        case "webp": return "image/webp";
        case "heic": return "image/heic";
        case "heif": return "image/heif";
        case "pdf": return "application/pdf";
        case "jpg":
        case "jpeg": return "image/jpeg";
        default: return "";
    }
};

const extensionForMime = (mime: string): string => {
    switch (mime) {
        case "application/pdf": return "pdf";
        case "image/png": return "png";
        case "image/webp": return "webp";
        case "image/heic": return "heic";
        case "image/heif": return "heif";
        default: return "jpg";
    }
};

const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== "android") { return true; }
    try {
        const permission = Number(Platform.Version) >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        if (await PermissionsAndroid.check(permission)) { return true; }

        const granted = await PermissionsAndroid.request(permission, {
            title: "Gallery Permission",
            message: "App needs access to your gallery to select document images.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
        return false;
    }
};

const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== "android") { return true; }
    try {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        if (await PermissionsAndroid.check(permission)) { return true; }

        const granted = await PermissionsAndroid.request(permission, {
            title: "Camera Permission",
            message: "App needs access to your camera to photograph your documents.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
        return false;
    }
};

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
    remoteLink?: string | null;
}

const useVendorDocumentUploadHook = () => {
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
    const { userData } = useSelector((state: RootState) => state.profileState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

    const shopId = shop?.shopId || userData?.shopId || "";

    const {
        data: documents,
        isFetching,
        refetch,
    } = useGetOnboardingDocumentsQuery(shopId, { skip: !shopId });

    const [uploadOnboardingDocument] = useUploadOnboardingDocumentMutation();

    const [slotState, setSlotState] = useState<Record<string, IDocSlotState>>({});

    const docs = useMemo<IOnboardingDocumentRequirement[]>(() => documents ?? [], [documents]);

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

    const applyPickedFile = (slug: string, uri: string, rawType: string, rawName: string, size: number) => {
        const type = ALLOWED_MIME.includes(rawType) ? rawType : (mimeFromName(rawName) || mimeFromName(uri));

        if (!ALLOWED_MIME.includes(type)) {
            Alert.alert("Unsupported file", "Use a PNG, JPEG, HEIC, or WEBP image, or a PDF.");
            return;
        }
        if (size > MAX_FILE_SIZE_BYTES) {
            Alert.alert("File too large", "Each document must be 1.5 MB or smaller.");
            return;
        }

        const name = rawName || uri.split("/").pop() || `${ slug }.${ extensionForMime(type) }`;

        setSlotState((prev) => ({
            ...prev,
            [slug]: {
                ...prev[slug],
                file: { uri, name, type, size },
                status: "selected",
                errorMessage: undefined,
            },
        }));
    };

    const pickFromGallery = async (slug: string) => {
        if (!(await requestGalleryPermission())) {
            Alert.alert("Permission Required", "Please allow access to your gallery to select document images.");
            return;
        }

        const response = await launchImageLibrary(IMAGE_PICKER_OPTIONS);
        if (response.didCancel) { return; }
        if (response.errorCode) {
            Alert.alert("Couldn't open gallery", response.errorMessage ?? "Please try again.");
            return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) { return; }

        applyPickedFile(slug, asset.uri, asset.type ?? "", asset.fileName ?? "", asset.fileSize ?? 0);
    };

    const pickFromCamera = async (slug: string) => {
        if (!(await requestCameraPermission())) {
            Alert.alert("Permission Required", "Please allow access to your camera to photograph your documents.");
            return;
        }

        const response = await launchCamera({ ...IMAGE_PICKER_OPTIONS, saveToPhotos: false });
        if (response.didCancel) { return; }
        if (response.errorCode) {
            Alert.alert("Couldn't open camera", response.errorMessage ?? "Please try again.");
            return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) { return; }

        applyPickedFile(slug, asset.uri, asset.type ?? "", asset.fileName ?? "", asset.fileSize ?? 0);
    };

    const pickFromFiles = async (slug: string) => {
        try {
            const picked = await DocumentPicker.pickSingle({
                type: [DocumentPickerTypes.images, DocumentPickerTypes.pdf],
                copyTo: "cachesDirectory",
                allowMultiSelection: false,
            });

            const uri = picked.fileCopyUri || picked.uri;
            if (!uri) { return; }

            applyPickedFile(slug, uri, picked.type ?? "", picked.name ?? "", picked.size ?? 0);
        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) { return; }
            Alert.alert("Couldn't pick file", err?.message ?? "Please try again.");
        }
    };

    const handlePickFile = (slug: string) => {
        const labels = ["Choose from Gallery", "Take a Photo", "Browse Files (PDF)", "Cancel"];
        const actions = [
            () => pickFromGallery(slug),
            () => pickFromCamera(slug),
            () => pickFromFiles(slug),
        ];

        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                { options: labels, cancelButtonIndex: labels.length - 1, title: "Upload document" },
                (index) => { actions[index]?.(); },
            );
            return;
        }

        Alert.alert("Upload document", "Where would you like to pick this document from?", [
            { text: labels[0], onPress: actions[0] },
            { text: labels[1], onPress: actions[1] },
            { text: labels[2], onPress: actions[2] },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const uploadOne = async (slug: string): Promise<boolean> => {
        const slot = slotState[slug];
        if (!slot?.file) { return false; }

        setSlotState((prev) => ({ ...prev, [slug]: { ...prev[slug], status: "uploading", errorMessage: undefined } }));

        try {
            const formData = new FormData();
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
        for (const doc of docs) {
            const slot = slotState[doc.slug];
            if (slot?.status === "uploaded") { continue; }
            if (!slot?.file) { continue; }
            await uploadOne(doc.slug);
        }
    };

    const handleFinish = () => {
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
