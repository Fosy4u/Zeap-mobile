/**
 * Formats a date string into a readable format
 * @param dateString - The date string to format (ISO format)
 * @param isCompact - If true, returns date in "dd/MM/yyyy" format
 * @returns Formatted date string
 */
const formatDate = (dateString: string, isCompact: boolean = false): string => {
    const date = new Date(dateString);

    if (isCompact) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return new Intl.DateTimeFormat('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

export default formatDate;