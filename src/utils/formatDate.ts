
type IDateInput = string | number | Date;

const formatDate = (dateString: IDateInput, isCompact: boolean = false, dateOnly: boolean = false): string => {
    if (!dateString && dateString !== 0) return "";

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
        // e.g. "23 June 2026" when dateOnly, otherwise the time is appended.
        ...(dateOnly ? {} : { hour: '2-digit', minute: '2-digit', hour12: true }),
    }).format(date);
};

export default formatDate;