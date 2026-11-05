export interface ICurrencyPhoneCode {
    name: string;
    dial_code: string;
    code: string;
    emoji: string;
}

const CURRENCY_TO_PHONE_CODE: Record<string, ICurrencyPhoneCode> = {
    NGN: { name: "Nigeria",        dial_code: "+234", code: "NG", emoji: "🇳🇬" },
    USD: { name: "United States",  dial_code: "+1",   code: "US", emoji: "🇺🇸" },
    GBP: { name: "United Kingdom", dial_code: "+44",  code: "GB", emoji: "🇬🇧" },
    CAD: { name: "Canada",         dial_code: "+1",   code: "CA", emoji: "🇨🇦" },
};

const DEFAULT_PHONE_CODE: ICurrencyPhoneCode = CURRENCY_TO_PHONE_CODE.NGN;

export const phoneCodeForCurrency = (currencyCode?: string): ICurrencyPhoneCode => {
    if (!currencyCode) { return DEFAULT_PHONE_CODE; }
    return CURRENCY_TO_PHONE_CODE[currencyCode.toUpperCase()] ?? DEFAULT_PHONE_CODE;
};

export const dialCodeForCurrency = (currencyCode?: string): string =>
    phoneCodeForCurrency(currencyCode).dial_code;
