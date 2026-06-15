// Shared lookup that ties the system's supported currencies to the phone-code
// they should default to. Used wherever a phone-number input needs to pick a
// sensible starting country code based on the user's currency setting
// (state.settingsState.recommendedCurrency.code).
//
// Keep this map in sync with the supported currencies in
// src/utils/currencies.json. NGN is the primary-market fallback when the
// currency hasn't been resolved yet (cold start) or comes back as an unknown
// code.

export interface ICurrencyPhoneCode {
    name: string;
    dial_code: string;
    code: string;   // ISO country code (e.g. "NG", "US") — matches the
                    // shape used by profileState.selectedPhoneCode.
    emoji: string;
}

const CURRENCY_TO_PHONE_CODE: Record<string, ICurrencyPhoneCode> = {
    NGN: { name: "Nigeria",        dial_code: "+234", code: "NG", emoji: "🇳🇬" },
    USD: { name: "United States",  dial_code: "+1",   code: "US", emoji: "🇺🇸" },
    GBP: { name: "United Kingdom", dial_code: "+44",  code: "GB", emoji: "🇬🇧" },
    CAD: { name: "Canada",         dial_code: "+1",   code: "CA", emoji: "🇨🇦" },
};

// Nigeria is the launch market — the right default when we have no other signal.
const DEFAULT_PHONE_CODE: ICurrencyPhoneCode = CURRENCY_TO_PHONE_CODE.NGN;

export const phoneCodeForCurrency = (currencyCode?: string): ICurrencyPhoneCode => {
    if (!currencyCode) { return DEFAULT_PHONE_CODE; }
    return CURRENCY_TO_PHONE_CODE[currencyCode.toUpperCase()] ?? DEFAULT_PHONE_CODE;
};

export const dialCodeForCurrency = (currencyCode?: string): string =>
    phoneCodeForCurrency(currencyCode).dial_code;
