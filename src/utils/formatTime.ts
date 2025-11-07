/**
 * Formats a date string into a relative time string (e.g., "23 min ago", "a week ago")
 * @param dateString - The date string to format
 * @returns A formatted relative time string
 */
type DateInput = string | number | Date;

const timeAgo = (dateInput: DateInput): string => {
    if (!dateInput && dateInput !== 0) return "";

    let date: Date;
    if (typeof dateInput === 'number') {
        date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // If the date is more than 30 days ago, return the actual date
    if (diffInSeconds > 30 * 24 * 60 * 60) {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Less than a minute
    if (diffInSeconds < 60) {
        return 'just now';
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min ago`;
    }

    // Less than a day
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    // Less than a week
    if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // Less than a month
    if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
    }

    // Less than a year
    if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return months === 1 ? 'a month ago' : `${months} months ago`;
    }

    // More than a year
    const years = Math.floor(diffInSeconds / 31536000);
    return years === 1 ? 'a year ago' : `${years} years ago`;
};

export { timeAgo };