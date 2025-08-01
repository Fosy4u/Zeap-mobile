/**
 * Formats a number into Nigerian Naira currency format
 * @param amount - The amount to format (in Naira)
 * @returns Formatted currency string (e.g., "₦6,400.00")
 */
const formatCurrency = (amount: number, currency: string = "NGN"): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'symbol'
    }).format(amount);
}; 

export default formatCurrency;