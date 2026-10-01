import React from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, DocumentText1, DocumentUpload, TickCircle, Warning2 } from "iconsax-react-native";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import useVendorDocumentUploadHook, { IDocSlotState } from "../hooks/vendorOnboarding/vendorDocumentUpload_hook";
import { IOnboardingDocumentRequirement } from "../apis/general_api";

// Backend doesn't return per-document examples yet, so we keep a local lookup
// keyed by slug. Adding a new slug here is the only place that needs touching.
const EXAMPLES_BY_SLUG: Record<string, string> = {
    proof_of_identity:     "International Passport, Driver's Licence, Voter's Card, etc.",
    business_registration: "CAC certificate, Incorporation Docs, etc.",
    business_address:      "Utility Bill, Bank Statement (≤ 3 Months), etc.",
};

interface IStatusBadgeProps {
    status: IDocSlotState["status"];
}

const StatusBadge: React.FC<IStatusBadgeProps> = ({ status }) => {
    if (status === "uploaded") {
        return (
            <View className="px-2.5 py-1 flex-row items-center rounded-full bg-green-100">
                <TickCircle size={ 12 } color="#15803d" variant="Bold" />
                <Text className="ml-1 font-montserratSemiBold text-[11px] text-green-700">Uploaded</Text>
            </View>
        );
    }
    if (status === "failed") {
        return (
            <View className="px-2.5 py-1 flex-row items-center rounded-full bg-red-100">
                <Warning2 size={ 12 } color="#b91c1c" variant="Bold" />
                <Text className="ml-1 font-montserratSemiBold text-[11px] text-red-700">Failed</Text>
            </View>
        );
    }
    if (status === "uploading") {
        return (
            <View className="px-2.5 py-1 flex-row items-center rounded-full bg-blue-100">
                <ActivityIndicator size={ 10 } color="#1d4ed8" />
                <Text className="ml-1 font-montserratSemiBold text-[11px] text-blue-700">Uploading</Text>
            </View>
        );
    }
    if (status === "selected") {
        return (
            <View className="px-2.5 py-1 rounded-full bg-yellow-100">
                <Text className="font-montserratSemiBold text-[11px] text-yellow-800">Ready to upload</Text>
            </View>
        );
    }
    return (
        <View className="px-2.5 py-1 rounded-full bg-gray-100">
            <Text className="font-montserratSemiBold text-[11px] text-gray-600">Pending</Text>
        </View>
    );
};

interface IDocCardProps {
    doc: IOnboardingDocumentRequirement;
    slot: IDocSlotState | undefined;
    onPickFile: (slug: string) => void;
    onUpload: (slug: string) => void;
}

const DocCard: React.FC<IDocCardProps> = ({ doc, slot, onPickFile, onUpload }) => {
    const status: IDocSlotState["status"] = slot?.status ?? "idle";
    const hasFile = !!slot?.file;
    const isUploading = status === "uploading";
    const isUploaded = status === "uploaded";

    const previewUri = slot?.file?.uri || slot?.remoteLink || null;
    /* A PDF can't render in <Image>, so we detect it from the picked file's
       mime type (or a .pdf remote link) and show a document tile instead. */
    const isPdf = slot?.file?.type === "application/pdf"
        || (!slot?.file && !!slot?.remoteLink && /\.pdf(\?|$)/i.test(slot.remoteLink));

    return (
        <View className="p-4 rounded-2xl bg-white border border-gray-100">
            {/*==== Header ====*/}
            <View className="flex-row items-start justify-between">
                <Text className="flex-1 mr-3 font-montserratBold text-sm text-baseGreen leading-5">
                    { doc.label }
                </Text>
                <StatusBadge status={ status } />
            </View>

            {/*==== Examples ====*/}
            { EXAMPLES_BY_SLUG[doc.slug] && (
                <Text className="mt-1.5 font-montserratMedium text-[11px] text-gray-500 leading-4">
                    Examples: { EXAMPLES_BY_SLUG[doc.slug] }
                </Text>
            ) }

            {/*==== Preview / placeholder ====*/}
            <View className="mt-3 h-32 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden items-center justify-center">
                { previewUri && isPdf ? (
                    <View className="items-center">
                        <DocumentText1 size={ 32 } color="#133522" variant="Bold" />
                        <Text className="mt-1.5 text-xs text-gray-600">PDF document</Text>
                        { !!slot?.file?.name && (
                            <Text numberOfLines={ 1 } className="mt-0.5 max-w-[200px] text-[11px] text-gray-400">
                                { slot.file.name }
                            </Text>
                        ) }
                    </View>
                ) : previewUri ? (
                    <Image
                        source={{ uri: previewUri }}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="items-center">
                        <DocumentUpload size={ 28 } color="#9ca3af" />
                        <Text className="mt-1.5 text-xs text-gray-400">No file selected</Text>
                    </View>
                ) }
            </View>

            {/*==== Error message ====*/}
            { status === "failed" && (
                <Text className="mt-2 text-xs text-red-600">
                    { slot?.errorMessage || "Upload failed. Please try again." }
                </Text>
            ) }

            {/*==== Actions ====*/}
            <View className="mt-3 flex-row">
                <TouchableOpacity
                    onPress={ () => onPickFile(doc.slug) }
                    disabled={ isUploading }
                    activeOpacity={ 0.85 }
                    className={ `flex-1 mr-2 h-11 items-center justify-center rounded-xl border border-baseGreen ${ isUploading ? "opacity-50" : "" }` }
                >
                    <Text className="font-montserratSemiBold text-sm text-baseGreen">
                        { hasFile || isUploaded ? "Change file" : "Select file" }
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={ () => onUpload(doc.slug) }
                    disabled={ !hasFile || isUploading || isUploaded }
                    activeOpacity={ 0.85 }
                    className={ `flex-1 h-11 flex-row items-center justify-center rounded-xl bg-green-600 ${ !hasFile || isUploaded ? "opacity-40" : "" }` }
                >
                    { isUploading
                        ? <ActivityIndicator color="#ffffff" />
                        : <Text className="font-montserratSemiBold text-sm text-white">{ isUploaded ? "Uploaded" : "Upload" }</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

const VendorDocumentUploadScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const {
        docs,
        slotState,
        uploadedCount,
        totalCount,
        isFetching,
        handlePickFile,
        handleUpload,
        handleUploadAll,
        handleFinish,
    } = useVendorDocumentUploadHook();

    const anySelectedNotUploaded = docs.some((d) => {
        const s = slotState[d.slug];
        return s?.file && s.status !== "uploaded" && s.status !== "uploading";
    });

    return (
        <View className="flex-1 bg-white">
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

            <SafeAreaView className="flex-1">
                {/*==== Top chrome ====*/}
                <View className="px-5 pt-3">
                    <View className="h-10 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            className="h-10 w-10 items-center justify-center rounded-full bg-baseGreen"
                        >
                            <ArrowLeft size={ 18 } color="#ffffff" />
                        </TouchableOpacity>

                        { totalCount > 0 && (
                            <View className="px-3 py-1.5 rounded-full bg-gray-100">
                                <Text className="font-montserratSemiBold text-[11px] text-gray-700">
                                    { uploadedCount } of { totalCount } uploaded
                                </Text>
                            </View>
                        ) }

                        <View className="h-10 w-10" />
                    </View>
                </View>

                {/*==== Body ====*/}
                <ScrollView
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: 160, paddingHorizontal: 20 }}
                >
                    <Text className="font-montserratBold text-[24px] text-baseGreen leading-tight">
                        Upload Your Documents
                    </Text>
                    <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-6">
                        Submit the documents below so our team can verify your shop and activate selling.
                    </Text>

                    { isFetching && docs.length === 0 ? (
                        <View className="mt-10 items-center">
                            <ActivityIndicator color="#133522" />
                            <Text className="mt-2 text-xs text-gray-500">Loading required documents…</Text>
                        </View>
                    ) : docs.length === 0 ? (
                        <View className="mt-10 p-5 rounded-2xl bg-gray-50 items-center">
                            <Text className="text-sm text-gray-500 text-center">
                                No documents to upload at the moment.
                            </Text>
                        </View>
                    ) : (
                        <View className="mt-6">
                            { docs.map((doc, idx) => (
                                <View key={ doc.slug } className={ idx === 0 ? "" : "mt-3" }>
                                    <DocCard
                                        doc={ doc }
                                        slot={ slotState[doc.slug] }
                                        onPickFile={ handlePickFile }
                                        onUpload={ handleUpload }
                                    />
                                </View>
                            )) }
                        </View>
                    ) }

                    <Text className="mt-5 text-[11px] text-gray-400 leading-5">
                        Files must be images (PNG / JPEG / WEBP) or PDF, max 1.5 MB each. You can upload them in any order. Editing is only available until your shop has been verified.
                    </Text>
                </ScrollView>

                {/*==== Sticky action bar ====*/}
                <View
                    className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-6 bg-white border-t border-gray-100"
                    style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8 }}
                >
                    <View className="flex-row gap-x-3">
                        <TouchableOpacity
                            onPress={ handleUploadAll }
                            disabled={ !anySelectedNotUploaded }
                            activeOpacity={ 0.85 }
                            className={ `flex-1 h-14 items-center justify-center rounded-2xl bg-green-600 ${ !anySelectedNotUploaded ? "opacity-40" : "" }` }
                        >
                            <Text className="font-montserratBold text-base text-white">Upload All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={ handleFinish }
                            activeOpacity={ 0.85 }
                            className="flex-1 h-14 items-center justify-center rounded-2xl bg-baseGreen"
                        >
                            <Text className="font-montserratBold text-base text-white">Finish</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default VendorDocumentUploadScreen;
