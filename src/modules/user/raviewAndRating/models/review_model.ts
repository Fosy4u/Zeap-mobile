
// Main review response
interface IReview {
    givenReviews: IGivenReview[];
    pendingReviews: IPendingReview[];
};

interface IGivenReview {
    order: IReviewOrder;
    rating: number | null;
};

interface IPendingReview {
    order: IReviewOrder;
    rating: number | null;
};

interface IReviewOrder {
    productId: string;
    title: string;
    images: IReviewImage[];
    orderId: string;
    color: string;
    size: string;
    sku: string;
    quantity: number;
    deliveryDate: string;
    reviewId?: string;
    reviewTitle?: string;
    reviewBody?: string;
    rating?: number;
    displayName?: string;
    imageMatch?: boolean;
};

interface IReviewImage {
    link: string;
    name: string;
    _id: string;
};

const normalizeReviewOrder = (review?: any): IReviewOrder => {
    const source = review?.order ?? review ?? {};
    const product = source?.product ?? {};

    const images: IReviewImage[] =
        source?.images ?? product?.images ?? source?.colors?.[0]?.images ?? [];

    const reviewBody = review?.review ?? source?.review ?? "";
    const rating = Number(review?.rating ?? source?.rating ?? 0) || 0;
    const hasReview = !!reviewBody || rating > 0;

    return {
        productId: source?.productId ?? product?.productId ?? source?._id ?? "",
        title: product?.title ?? source?.productName ?? source?.productTitle ?? source?.title ?? "",
        images,
        orderId: source?.orderId ?? source?.order?.orderId ?? "",
        color: source?.color ?? source?.bespokeColor ?? "",
        size: source?.size ?? "",
        sku: source?.sku ?? "",
        quantity: source?.quantity ?? 0,
        deliveryDate: source?.deliveryDate ?? source?.deliveredOn ?? source?.updatedAt ?? "",
        reviewId: hasReview ? (review?.review_id ?? review?.reviewId ?? review?._id ?? source?.review_id ?? source?.reviewId ?? "") : "",
        reviewTitle: source?.reviewTitle ?? source?.title ?? "",
        reviewBody,
        rating,
        displayName: review?.displayName ?? source?.displayName ?? "",
        imageMatch: review?.imageMatch ?? source?.imageMatch,
    };
};

const formatReviewDate = (value?: string): string => {
    if (!value) { return "N/A"; }
    const date = new Date(value);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
};

export { normalizeReviewOrder, formatReviewDate };
export type { IGivenReview, IPendingReview, IReviewOrder, IReviewImage };
export default IReview;