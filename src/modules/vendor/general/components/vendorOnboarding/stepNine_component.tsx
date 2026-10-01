import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Edit2, ShieldTick } from "iconsax-react-native";
import { IVendorOnboardingFormData } from "../../models/vendorOnboardingState_model";

interface IProps {
    formData: IVendorOnboardingFormData;
    onJumpToStep: (step: number) => void;
}

interface IReviewCardProps {
    title: string;
    targetStep: number;
    onJumpToStep: (step: number) => void;
    rows: Array<[label: string, value: string]>;
}

const ReviewCard: React.FC<IReviewCardProps> = ({ title, targetStep, onJumpToStep, rows }) => (
    <View className="p-4 rounded-2xl bg-white border border-gray-100">
        <View className="flex-row items-center justify-between">
            <Text className="font-montserratBold text-sm text-baseGreen">{ title }</Text>
            <TouchableOpacity
                onPress={ () => onJumpToStep(targetStep) }
                className="px-3 py-1.5 flex-row items-center rounded-full bg-gold/15"
            >
                <Edit2 size={ 12 } color="#D5B07B" variant="Bold" />
                <Text className="ml-1 font-montserratSemiBold text-[11px] text-gold">Edit</Text>
            </TouchableOpacity>
        </View>
        <View className="mt-3">
            { rows.map(([label, value], idx) => (
                <View key={ label } className={ `flex-row items-start ${ idx === 0 ? "" : "mt-2.5" }` }>
                    <Text className="w-[40%] text-[11px] uppercase tracking-wider text-gray-500">{ label }</Text>
                    <Text className="flex-1 font-montserratMedium text-sm text-black" numberOfLines={ 2 }>
                        { value || "—" }
                    </Text>
                </View>
            )) }
        </View>
    </View>
);

const StepNineComponent: React.FC<IProps> = ({ formData, onJumpToStep }) => {
    // Compact socials — only show entries the user actually filled in to avoid
    // a wall of em-dashes in the review.
    const filledSocials = ([
        ["Website", formData.website],
        ["TikTok", formData.tiktok],
        ["Instagram", formData.instagram],
        ["Facebook", formData.facebook],
        ["X (Twitter)", formData.twitter],
        ["LinkedIn", formData.linkedin],
    ] as Array<[string, string]>).filter(([, v]) => !!v);

    return (
        <View className="px-5">
            <View className="pt-2">
                <Text className="font-montserratBold text-[28px] text-baseGreen leading-tight">
                    Review Your Shop Details
                </Text>
                <Text className="mt-3 font-montserratMedium text-sm text-gray-500 leading-6">
                    Take a moment to double-check your details. Tap any section to edit before you submit.
                </Text>
            </View>

            <View className="mt-8">
                <ReviewCard
                    title="Shop"
                    targetStep={ 1 }
                    onJumpToStep={ onJumpToStep }
                    rows={ [["Business name", formData.businessName]] }
                />

                <View className="mt-3">
                    <ReviewCard
                        title="Services"
                        targetStep={ 2 }
                        onJumpToStep={ onJumpToStep }
                        rows={ [
                            ["Bespoke tailoring", formData.isTailor ? "Yes" : "No"],
                            ["Bespoke shoemaking", formData.isShoeMaker ? "Yes" : "No"],
                        ] }
                    />
                </View>

                <View className="mt-3">
                    <ReviewCard
                        title="Contact"
                        targetStep={ 3 }
                        onJumpToStep={ onJumpToStep }
                        rows={ [
                            ["Email", formData.businessEmail],
                            ["Phone", `${ formData.businessPhoneCode } ${ formData.businessPhone }`.trim()],
                        ] }
                    />
                </View>

                <View className="mt-3">
                    <ReviewCard
                        title="Location"
                        targetStep={ 4 }
                        onJumpToStep={ onJumpToStep }
                        rows={ [
                            ["Address", formData.address],
                            ["Country", formData.country],
                            ["Region", formData.region],
                        ] }
                    />
                </View>

                <View className="mt-3">
                    <ReviewCard
                        title="Payouts"
                        targetStep={ 5 }
                        onJumpToStep={ onJumpToStep }
                        rows={ [
                            ["Bank", formData.bankName],
                            ["Account name", formData.accountName],
                            ["Account number", formData.accountNumber.replace(/.(?=.{4})/g, "•") ],
                        ] }
                    />
                </View>

                <View className="mt-3">
                    <ReviewCard
                        title="Socials"
                        targetStep={ 6 }
                        onJumpToStep={ onJumpToStep }
                        rows={ filledSocials.length === 0
                            ? [["", "None provided"]]
                            : filledSocials
                        }
                    />
                </View>

                <View className="mt-3">
                    <ReviewCard
                        title="Heard about us"
                        targetStep={ 8 }
                        onJumpToStep={ onJumpToStep }
                        rows={ [["Source", formData.referralSource]] }
                    />
                </View>

                <View className="mt-5 p-4 flex-row items-start rounded-2xl bg-baseGreen/[0.05] border border-baseGreen/[0.15]">
                    <ShieldTick size={ 20 } color="#133522" variant="Bold" />
                    <Text className="ml-2 flex-1 text-xs text-baseGreen leading-5">
                        By tapping <Text className="font-montserratSemiBold">Submit</Text>, you confirm the information above is accurate and you've agreed to the Vendor Contract, Policy &amp; Terms.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default StepNineComponent;
