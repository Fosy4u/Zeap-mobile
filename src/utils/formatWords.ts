
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

    // Display label for a product's group/type badge. Maps the backend "Ready-Made"
    // group to "Ready to Wear Cloth/Shoe" and leaves other groups (e.g. Bespoke) alone.
    //
    // `productId` is optional and used as a fallback: slimmed-down endpoints
    // such as /products/live/recommended omit categories.productGroup and
    // productType, so we'd otherwise show "N/A" on those cards. The productId
    // follows the pattern `shopId/TYPE_CODE/productCode` where TYPE_CODE is
    // one of: BSC (Bespoke Cloth), BSS (Bespoke Shoe), RMC (Ready-Made
    // Cloth), RMS (Ready-Made Shoe), ACC (Accessory).
    static productGroupLabel = (productGroup?: string, productType?: string, productId?: string) => {
        if ((!productGroup || !productType) && productId) {
            const code = productId.split("/")[1]?.toUpperCase();
            const derived: Record<string, { group: string; type: string }> = {
                BSC: { group: "Bespoke", type: "bespokeCloth" },
                BSS: { group: "Bespoke", type: "bespokeShoe" },
                RMC: { group: "Ready-Made", type: "readyMadeCloth" },
                RMS: { group: "Ready-Made", type: "readyMadeShoe" },
                ACC: { group: "Ready-Made", type: "accessory" },
            };
            const fallback = code ? derived[code] : undefined;
            if (fallback) {
                productGroup = productGroup || fallback.group;
                productType = productType || fallback.type;
            }
        }

        // Accessories (eyewear, watches, bags…) are technically ready-made but
        // aren't "worn" — label them by their own group rather than the shared
        // "Ready to Wear" badge.
        if (productType === "accessory") return "Accessories";

        if (!productGroup) return "N/A";
        const isReadyMade = productGroup === "Ready-Made" || productGroup === "Ready Made";
        // Ready-made cloth & shoe share a single "Ready to Wear" badge. The
        // cloth/shoe distinction was previously surfaced here but adds noise on
        // small cards.
        if (isReadyMade) return "Ready to Wear";
        return productGroup.split("-").join(" ");
    };
}

export default FormatWords;