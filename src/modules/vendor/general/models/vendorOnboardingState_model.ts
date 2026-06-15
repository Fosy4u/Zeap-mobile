interface ISellerPolicy {
    link: string;
    name: string;
}

interface IVendorOnboardingFormData {
    // Step 1
    businessName: string;

    // Step 2 — null = unanswered (Yes/No tiles must be tapped to proceed)
    isTailor: boolean | null;
    isShoeMaker: boolean | null;

    // Step 3
    businessEmail: string;
    businessPhoneCode: string;
    businessPhone: string;

    // Step 4
    address: string;
    country: string;
    region: string;

    // Step 5
    bankName: string;
    accountName: string;
    accountNumber: string;

    // Step 6 — all optional
    website: string;
    tiktok: string;
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;

    // Step 7
    agreedToTerms: boolean;

    // Step 8
    referralSource: string;
}

interface IVendorOnboardingState {
    selectedStep: number;
    formData: IVendorOnboardingFormData;
    sellerPolicies: ISellerPolicy[];
    isSubmitting: boolean;
    loadingMessage: string;
}

export type { ISellerPolicy, IVendorOnboardingFormData };
export default IVendorOnboardingState;
