const NON_CANCELLABLE_STATUSES = [
    "quality check",
    "ready",              // "ready" / "ready for delivery"
    "out for delivery",
    "dispatched",
    "delivered",          // word-bounded, so it never matches "out for delivery"
    "cancelled",
    "rejected",
];

interface IOrderLifecycleStatus {
    name?: string;
    value?: string;
};

const isPastCancellationCutoff = (status?: IOrderLifecycleStatus): boolean => {
    const haystack = `${ status?.name ?? "" } ${ status?.value ?? "" }`.toLowerCase().trim();
    if (!haystack) { return false; }

    return NON_CANCELLABLE_STATUSES.some(
        (blocked) => new RegExp(`\\b${ blocked }\\b`).test(haystack),
    );
};

/* `fallbackWhenUnknown` decides an absent status, which the two callers answer
   differently — see each one's own comment for why. */
const canCancelOrderAtStatus = (
    status: IOrderLifecycleStatus | undefined,
    fallbackWhenUnknown: boolean,
): boolean => {
    const haystack = `${ status?.name ?? "" } ${ status?.value ?? "" }`.trim();
    if (!haystack) { return fallbackWhenUnknown; }

    return !isPastCancellationCutoff(status);
};

export { canCancelOrderAtStatus, NON_CANCELLABLE_STATUSES };
export type { IOrderLifecycleStatus };
