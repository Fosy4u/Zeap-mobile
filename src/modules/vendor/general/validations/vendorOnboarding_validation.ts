import * as yup from "yup";

const accountNumberRegex = /^[0-9]{10}$/;

interface IPhoneRule {
    length: number;
    prefixes: string[];
    label: string;
}
const PHONE_RULES: Record<string, IPhoneRule> = {
    "+234": {
        length: 10,
        prefixes: ["70", "71", "80", "81", "90", "91"],
        label: "70, 71, 80, 81, 90, or 91",
    },
    "+1": {
        length: 10,
        prefixes: Array.from({ length: 80 }, (_, i) => String(20 + i)),
        label: "a digit 2 through 9",
    },
    "+44": {
        length: 10,
        prefixes: ["71", "72", "73", "74", "75", "77", "78", "79"],
        label: "71 through 79",
    },
};
const GENERIC_PHONE_REGEX = /^[0-9]{6,15}$/;

export const phoneLengthForCode = (code?: string): number => {
    const rule = PHONE_RULES[code ?? ""];
    return rule ? rule.length : 15;
};

const isObviousFakeDigitPattern = (value?: string): boolean => {
    if (!value) { return false; }
    if (/^(\d)\1+$/.test(value)) { return true; }
    const digits = value.split("").map((c) => Number(c));
    const isAscending = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
    if (isAscending) { return true; }
    const isDescending = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
    if (isDescending) { return true; }
    return false;
};

const hasLongSequentialRun = (value: string, maxRun = 4): boolean => {
    let ascending = 1;
    let descending = 1;
    for (let i = 1; i < value.length; i++) {
        const diff = Number(value[i]) - Number(value[i - 1]);
        ascending = diff === 1 ? ascending + 1 : 1;
        descending = diff === -1 ? descending + 1 : 1;
        if (ascending > maxRun || descending > maxRun) { return true; }
    }
    return false;
};
const SOCIAL_MAX = 200;

// Website: must begin with http://, https:// or www. and contain a domain.
const WEBSITE_REGEX = /^(https?:\/\/|www\.)[^\s.]+(\.[^\s.]+)+.*$/i;
// Handle: "@" followed by letters/numbers/dot/underscore (TikTok, Instagram, X).
const HANDLE_REGEX = /^@[A-Za-z0-9._]{1,30}$/;
const FACEBOOK_REGEX = /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9._\-]+\/?$/i;
// LinkedIn: optional scheme/www, then linkedin.com/<path>.
const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9._\-\/]+\/?$/i;

const optionalSocial = (regex: RegExp, message: string) =>
    yup
        .string()
        .trim()
        .max(SOCIAL_MAX, "Too long.")
        .test("social-format", message, (value) => {
            if (!value || value.trim().length === 0) { return true; }
            return regex.test(value.trim());
        });


const stepOneSchema = yup.object().shape({
    businessName: yup
        .string()
        .trim()
        .required("Business name is required.")
        .min(2, "Business name is too short.")
        .max(80, "Business name is too long."),
});

const stepTwoSchema = yup.object().shape({
    isTailor: yup
        .boolean()
        .typeError("Please answer the tailoring question.")
        .required("Please answer the tailoring question."),
    isShoeMaker: yup
        .boolean()
        .typeError("Please answer the shoe making question.")
        .required("Please answer the shoe making question."),
});

const stepThreeSchema = yup.object().shape({
    businessEmail: yup
        .string()
        .trim()
        .required("Business email is required.")
        .email("Enter a valid email address."),
    businessPhoneCode: yup
        .string()
        .required("Country code is required."),
    businessPhone: yup
        .string()
        .trim()
        .required("Phone number is required.")
        .test("country-aware-phone", "Enter a valid phone number.", function (value) {
            if (!value) { return true; }
            const code: string = this.parent.businessPhoneCode || "+234";
            const digits = value.replace(/\D/g, "");

            if (isObviousFakeDigitPattern(digits)) {
                return this.createError({ message: "Enter a valid phone number." });
            }

            const rule = PHONE_RULES[code];
            if (rule) {
                if (digits.length !== rule.length) {
                    return this.createError({
                        message: "Invalid phone Number",
                    });
                }
                const prefix = digits.slice(0, rule.prefixes[0].length);
                if (!rule.prefixes.includes(prefix)) {
                    return this.createError({
                        message: `Number must start with ${ rule.label }.`,
                    });
                }
                return true;
            }

            if (!GENERIC_PHONE_REGEX.test(digits)) {
                return this.createError({ message: "Enter a valid phone number." });
            }
            return true;
        }),
});

const stepFourSchema = yup.object().shape({
    address: yup
        .string()
        .trim()
        .required("Address is required.")
        .min(5, "Address is too short."),
    country: yup
        .string()
        .required("Country is required."),
    region: yup
        .string()
        .trim()
        .required("Region is required."),
});

const stepFiveSchema = yup.object().shape({
    bankName: yup
        .string()
        .trim()
        .required("Bank name is required."),
    accountName: yup
        .string()
        .trim()
        .required("Account name is required.")
        .min(2, "Account name is too short."),
    accountNumber: yup
        .string()
        .trim()
        .required("Account number is required.")
        .matches(accountNumberRegex, "Account number must be 10 digits.")
        .test(
            "not-a-fake-account",
            "Enter a real account number — repeated or sequential digits aren't accepted.",
            (value) => {
                if (!value) { return true; }
                const digits = value.trim();
                if (/^(\d)\1+$/.test(digits)) { return false; }
                if (hasLongSequentialRun(digits, 4)) { return false; }
                return true;
            },
        ),
    confirmAccountNumber: yup
        .string()
        .trim()
        .required("Please confirm your account number.")
        .oneOf([yup.ref("accountNumber")], "Account numbers do not match."),
});

const stepSixSchema = yup.object().shape({
    website: optionalSocial(WEBSITE_REGEX, "Enter a valid website starting with http://, https:// or www."),
    tiktok: optionalSocial(HANDLE_REGEX, "Enter your TikTok handle, e.g. @yourhandle."),
    instagram: optionalSocial(HANDLE_REGEX, "Enter your Instagram handle, e.g. @yourhandle."),
    facebook: optionalSocial(FACEBOOK_REGEX, "Enter your Facebook page, e.g. facebook.com/yourpage."),
    twitter: optionalSocial(HANDLE_REGEX, "Enter your X (Twitter) handle, e.g. @yourhandle."),
    linkedin: optionalSocial(LINKEDIN_REGEX, "Enter your LinkedIn URL, e.g. linkedin.com/in/yourname."),
});

const stepSevenSchema = yup.object().shape({
    agreedToTerms: yup
        .boolean()
        .oneOf([true], "You must agree to the vendor contract, policy & terms.")
        .required("You must agree to the vendor contract, policy & terms."),
});

const stepEightSchema = yup.object().shape({
    referralSource: yup
        .string()
        .required("Please tell us how you heard about us."),
});


export type IStepOneForm = yup.InferType<typeof stepOneSchema>;
export type IStepTwoForm = yup.InferType<typeof stepTwoSchema>;
export type IStepThreeForm = yup.InferType<typeof stepThreeSchema>;
export type IStepFourForm = yup.InferType<typeof stepFourSchema>;
export type IStepFiveForm = yup.InferType<typeof stepFiveSchema>;
export type IStepSixForm = yup.InferType<typeof stepSixSchema>;
export type IStepSevenForm = yup.InferType<typeof stepSevenSchema>;
export type IStepEightForm = yup.InferType<typeof stepEightSchema>;

export {
    stepOneSchema,
    stepTwoSchema,
    stepThreeSchema,
    stepFourSchema,
    stepFiveSchema,
    stepSixSchema,
    stepSevenSchema,
    stepEightSchema,
};
