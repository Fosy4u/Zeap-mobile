/**
 * Formats a number into Nigerian Naira currency format
 * @param amount - The amount to format (in Naira)
 * @returns Formatted currency string (e.g., "₦6,400.00")
 */
const formatCurrency = (amount: number | string, currency: string = "NGN", showDecimal: boolean = true): string => {

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

    return new Intl.NumberFormat(
        currencyLocaleMap[currency] || "en-NG",
        {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: showDecimal ? 2 : 0,
            maximumFractionDigits: showDecimal ? 2 : 0,
            currencyDisplay: 'symbol'
        }
    ).format(numericAmount);
}; 

export default formatCurrency;