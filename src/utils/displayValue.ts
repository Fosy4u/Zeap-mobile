
export const display = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    const str = String(value).trim();
    return str.length > 0 ? str : "N/A";
};

export const yesNo = (value: any): string => (value ? "Yes" : "No");
