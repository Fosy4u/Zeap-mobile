const NON_CANCELLABLE_STATUSES = [
    "processing",
    "quality check",
    "ready",
    "out for delivery",
    "dispatched",
    "delivered",
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
