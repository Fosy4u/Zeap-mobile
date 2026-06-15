import * as yup from "yup";

// Nigerian NUBAN — bank account numbers are exactly 10 digits.
const accountNumberRegex = /^[0-9]{10}$/;

// Per-country mobile-number rules. Scoped to the countries whose currencies
// the platform actually supports (NGN, USD, GBP, CAD) — there's no point
// strict-validating dial codes from markets we can't pay out to. The map is
// keyed by dial code (the value stored in `businessPhoneCode`). `length` is
// the number of digits after the country code; `prefixes` is the allow-listed
// leading digits of mobile numbers in that country. Codes not in the map fall
// through to the generic ITU E.164 length range below.
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
// Permissive URL check — accepts bare handles or full URLs since users paste
// either; only fully empty strings or obvious whitespace get rejected. Each
// social field is optional so the empty-string case still passes.
const optionalUrl = yup
    .string()
    .trim()
    .max(200, "Too long.")
    .test("no-whitespace-only", "Invalid value.", (value) => {
        if (!value) { return true; }
        return value.trim().length > 0;
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
                return this.createError({ message: "Enter a real phone number — repeated or sequential digits aren't accepted." });
            }

            const rule = PHONE_RULES[code];
            if (rule) {
                if (digits.length !== rule.length) {
                    return this.createError({
                        message: `Phone must be ${ rule.length } digits for ${ code }.`,
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
        .matches(accountNumberRegex, "Account number must be exactly 10 digits.")
        .test(
            "not-a-fake-digit-pattern",
            "Enter a real account number — repeated or sequential digits aren't accepted.",
            (value) => !isObviousFakeDigitPattern(value),
        ),
    confirmAccountNumber: yup
        .string()
        .trim()
        .required("Please confirm your account number.")
        .oneOf([yup.ref("accountNumber")], "Account numbers do not match."),
});

const stepSixSchema = yup.object().shape({
    website: optionalUrl,
    tiktok: optionalUrl,
    instagram: optionalUrl,
    facebook: optionalUrl,
    twitter: optionalUrl,
    linkedin: optionalUrl,
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
