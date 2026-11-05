class FormatWords {

    // Truncate words
    static truncateWords = (text: string, maxLength: number = 30) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + "...";
    };

    // Capitalize first word
    static capitalizeWord = (text?: string) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // Capitalize first letter of each word
    static capitalizeWords = (text?: string) => {
        if (!text) return "";
        return text.replace(/\b\w/g, char => char.toUpperCase());
    };

    static productGroupLabel = (productGroup?: string, productType?: string, productId?: string) => {
        const code = productId?.split("/")[1]?.toUpperCase();

        if ((!productGroup || !productType) && code) {
            const derived: Record<string, { group: string; type: string }> = {
                BSC: { group: "Bespoke", type: "bespokeCloth" },
                BSS: { group: "Bespoke", type: "bespokeShoe" },
                RMC: { group: "Ready-Made", type: "readyMadeCloth" },
                RMS: { group: "Ready-Made", type: "readyMadeShoe" },
                ACC: { group: "Ready-Made", type: "accessory" },
            };
            const fallback = derived[code];
            if (fallback) {
                productGroup = productGroup || fallback.group;
                productType = productType || fallback.type;
            }
        }

        if (productType?.toLowerCase() === "accessory" || code === "ACC") return "Accessory";

        if (!productGroup) return "N/A";
        const isReadyMade = productGroup === "Ready-Made" || productGroup === "Ready Made";
        if (isReadyMade) return "Ready to Wear";
        return productGroup.split("-").join(" ");
    };
}

export default FormatWords;