
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
}

export default FormatWords;