import * as yup from "yup";

// Bank account numbers: exactly 10 digits (Nigerian NUBAN). Anything other
// than 10 digits is rejected.
const accountNumberRegex = /^[0-9]{10}$/;

interface IPhoneRule {
    length: number;
    prefixes: string[]; // 2-digit mobile prefixes (e.g. ["70", "80", "81", "90", "91"])
    label: string;     // human-readable list for the error message
}
const PHONE_RULES: Record<string, IPhoneRule> = {
    // Nigeria → NGN
    "+234": {
        length: 10,
        prefixes: ["70", "71", "80", "81", "90", "91"],
        label: "70, 71, 80, 81, 90, or 91",
    },
    // US + Canada → USD / CAD (share the NANP dial code).
    // Area code's first digit must be 2-9; second digit can be anything.
    "+1": {
        length: 10,
        prefixes: Array.from({ length: 80 }, (_, i) => String(20 + i)),
        label: "a digit 2 through 9",
    },
    // United Kingdom → GBP. Mobile numbers begin with 7, total 10 digits
    // after the country code.
    "+44": {
        length: 10,
        prefixes: ["71", "72", "73", "74", "75", "77", "78", "79"],
        label: "71 through 79",
    },
};
// Generic fallback for unmapped country codes — ITU E.164 allows 4-15 digits
// for the subscriber number; we keep the floor at 6 to weed out garbage.
const GENERIC_PHONE_REGEX = /^[0-9]{6,15}$/;

// Required digit count per dial code (mirrors PHONE_RULES); unmapped → E.164 max.
export const phoneLengthForCode = (code?: string): number => {
    const rule = PHONE_RULES[code ?? ""];
    return rule ? rule.length : 15;
};

// Reject digit strings that are clearly placeholders / test data:
//   • all-same-digit:   00000000, 1111111, 333333…
//   • strictly ascending: 12345, 0123456789…
//   • strictly descending: 987654321, 9876…
// Returns true when the value is "real-looking" (passes the test), false when
// it should be flagged. Empty values pass through so .required() owns the
// "missing" message.
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

// Detects a run of consecutive ascending OR descending digits longer than
// `maxRun` ANYWHERE in the string (e.g. "12345", "98765"). Unlike
// isObviousFakeDigitPattern (which only flags a string that is sequential
// end-to-end), this catches a long ladder embedded in an otherwise normal
// number — e.g. "0123456789" or "9123456780". Real account numbers don't
// contain a 5+ digit ladder; placeholder/test data does. maxRun = 4 means a
// run of 5 or more consecutive digits is rejected.
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
// Social-media fields are all OPTIONAL — an empty value always passes so the
// step is skippable. But the moment the user types something, it must match
// the format hinted in the placeholder. Each builder below short-circuits on
// empty/whitespace and otherwise enforces the field's regex.
const SOCIAL_MAX = 200;

// Website: must begin with http://, https:// or www. and contain a domain.
const WEBSITE_REGEX = /^(https?:\/\/|www\.)[^\s.]+(\.[^\s.]+)+.*$/i;
// Handle: "@" followed by letters/numbers/dot/underscore (TikTok, Instagram, X).
const HANDLE_REGEX = /^@[A-Za-z0-9._]{1,30}$/;
// Facebook page: optional scheme/www, then facebook.com/<page>.
const FACEBOOK_REGEX = /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9._\-]+\/?$/i;
// LinkedIn: optional scheme/www, then linkedin.com/<path>.
const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9._\-\/]+\/?$/i;

const optionalSocial = (regex: RegExp, message: string) =>
    yup
        .string()
        .trim()
        .max(SOCIAL_MAX, "Too long.")
        .test("social-format", message, (value) => {
            if (!value || value.trim().length === 0) { return true; } // optional → skip
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

            // Catch obviously fake inputs (all-same / sequential) on any country.
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

            // Unmapped country — fall back to ITU E.164 length range.
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
                if (/^(\d)\1+$/.test(digits)) { return false; }        // all identical, e.g. 0000000000
                if (hasLongSequentialRun(digits, 4)) { return false; } // 5+ digit ladder, e.g. 0123456789
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
