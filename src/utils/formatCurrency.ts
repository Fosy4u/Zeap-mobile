const formatCurrency = (amount: number | string, currency: string = "NGN"): string => {

    const currencyLocaleMap: Record<string, string> = {
        NGN: "en-NG", // Nigerian Naira → Nigeria
        USD: "en-US", // US Dollar → United States
        EUR: "de-DE", // Euro → Germany
        GBP: "en-GB", // British Pound → United Kingdom
        JPY: "ja-JP", // Japanese Yen → Japan
        CNY: "zh-CN", // Chinese Yuan → China
        CAD: "en-CA", // Canadian Dollar → Canada
        AUD: "en-AU", // Australian Dollar → Australia
    };

    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) {
        throw new Error("Invalid amount. Please provide a valid number or numeric string.");
    }

    /* Tested on the amount rounded to the nearest minor unit, so 999.999 counts
       as whole (₦1,000) instead of slipping through as a fractional ₦1,000.00. */
    const hasFraction = Math.round(numericAmount * 100) % 100 !== 0;
    const fractionDigits = (currency.toUpperCase() === "NGN" && !hasFraction) ? 0 : 2;

    return new Intl.NumberFormat(
        currencyLocaleMap[currency] || "en-NG",
        {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
            currencyDisplay: 'symbol'
        }
    ).format(numericAmount);
};

export default formatCurrency;
