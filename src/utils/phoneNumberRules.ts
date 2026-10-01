/* Per-country phone number rules for the delivery-address forms. Keys match
   src/utils/deliveryCountries.json, with aliases for stored/ISO variants. */

export interface IPhoneRule {
    dialCode: string;
    // Valid lengths of the national significant number (no dial code, no trunk "0").
    nsnLengths: number[];
    nsnPattern: RegExp;
    // Leading digit typed locally instead of the dial code ("0" for NG/UK).
    trunkPrefix: string;
    placeholder: string;
    hint: string;
    errorMessage: string;
}

const NIGERIA: IPhoneRule = {
    dialCode: "+234",
    nsnLengths: [10],
    nsnPattern: /^[789]\d{9}$/,
    trunkPrefix: "0",
    placeholder: "08012345678",
    hint: "Format: 11 digits starting with 0 — e.g. 08012345678 (or +2348012345678).",
    errorMessage: "Enter a valid Nigerian phone number: 11 digits starting with 0, e.g. 08012345678.",
};

const UNITED_KINGDOM: IPhoneRule = {
    dialCode: "+44",
    nsnLengths: [9, 10],
    nsnPattern: /^[1-9]\d{8,9}$/,
    trunkPrefix: "0",
    placeholder: "07123456789",
    hint: "Format: 11 digits starting with 0 — e.g. 07123456789 (or +447123456789).",
    errorMessage: "Enter a valid UK phone number: 10–11 digits starting with 0, e.g. 07123456789.",
};

const NANP = (country: string, example: string): IPhoneRule => ({
    dialCode: "+1",
    nsnLengths: [10],
    nsnPattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    trunkPrefix: "",
    placeholder: example,
    hint: `Format: 10 digits — e.g. ${ example } (or +1${ example }).`,
    errorMessage: `Enter a valid ${ country } phone number: 10 digits, e.g. ${ example }.`,
});

const FALLBACK: IPhoneRule = {
    dialCode: "",
    nsnLengths: [7, 8, 9, 10, 11, 12, 13, 14, 15],
    nsnPattern: /^\d{7,15}$/,
    trunkPrefix: "",
    placeholder: "Enter phone number",
    hint: "Enter your phone number in your country's format.",
    errorMessage: "Enter a valid phone number.",
};

const PHONE_RULES: Record<string, IPhoneRule> = {
    Nigeria: NIGERIA,
    NG: NIGERIA,
    UK: UNITED_KINGDOM,
    GB: UNITED_KINGDOM,
    "United Kingdom": UNITED_KINGDOM,
    USA: NANP("US", "4155551234"),
    US: NANP("US", "4155551234"),
    "United States of America": NANP("US", "4155551234"),
    Canada: NANP("Canadian", "4165551234"),
    CA: NANP("Canadian", "4165551234"),
};

export const phoneRuleForCountry = (countryKey?: string): IPhoneRule =>
    (countryKey && PHONE_RULES[countryKey.trim()]) || FALLBACK;

const digitsOf = (raw?: string): string => (raw || "").replace(/\D/g, "");

/* How many digits the field may hold, given whether the user is typing the
   international, trunk-prefixed, or bare national form. */
const digitLimit = (digits: string, rule: IPhoneRule): number => {
    const dial = digitsOf(rule.dialCode);
    const maxNsn = Math.max(...rule.nsnLengths);

    if (dial && digits.startsWith(dial) && digits.length > dial.length) {
        return dial.length + maxNsn;
    }
    if (rule.trunkPrefix && digits.startsWith(rule.trunkPrefix)) {
        return rule.trunkPrefix.length + maxNsn;
    }
    return maxNsn;
};

// Strip the dial code / trunk prefix to get the national significant number.
export const nationalNumberOf = (raw: string | undefined, rule: IPhoneRule): string => {
    const digits = digitsOf(raw);
    const dial = digitsOf(rule.dialCode);

    if (dial && digits.startsWith(dial) && digits.length > dial.length) {
        return digits.slice(dial.length);
    }
    if (rule.trunkPrefix && digits.startsWith(rule.trunkPrefix)) {
        return digits.slice(rule.trunkPrefix.length);
    }
    return digits;
};

/* Keeps only digits (plus a leading "+") and hard-caps the length so the field
   can never hold more digits than the selected country allows. */
export const sanitizePhoneInput = (raw: string, countryKey?: string): string => {
    const rule = phoneRuleForCountry(countryKey);
    const hasPlus = (raw || "").trimStart().startsWith("+");
    const digits = digitsOf(raw);

    return `${ hasPlus ? "+" : "" }${ digits.slice(0, digitLimit(digits, rule)) }`;
};

// Longest string the input can hold — a backstop behind sanitizePhoneInput.
export const maxPhoneLengthForCountry = (countryKey?: string): number => {
    const rule = phoneRuleForCountry(countryKey);
    return digitsOf(rule.dialCode).length + Math.max(...rule.nsnLengths) + 1;
};

export const isValidPhoneForCountry = (raw: string | undefined, countryKey?: string): boolean => {
    const rule = phoneRuleForCountry(countryKey);
    const nsn = nationalNumberOf(raw, rule);
    return rule.nsnLengths.includes(nsn.length) && rule.nsnPattern.test(nsn);
};

export const phoneHintForCountry = (countryKey?: string): string =>
    phoneRuleForCountry(countryKey).hint;

export const phonePlaceholderForCountry = (countryKey?: string): string =>
    phoneRuleForCountry(countryKey).placeholder;

export const phoneErrorForCountry = (countryKey?: string): string =>
    phoneRuleForCountry(countryKey).errorMessage;
