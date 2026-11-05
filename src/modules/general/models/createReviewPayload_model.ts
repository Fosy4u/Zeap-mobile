interface ICreateReviewPayload {
    productId: string;
    orderId?: string;
    sku?: string;
    title: string;
    review: string;
    rating: number;
    displayName: string;
    imageMatch: boolean;
}

export default ICreateReviewPayload;

interface IUpdateReviewPayload {
    productId: string;
    review_id: string;
    title: string;
    review: string;
    rating: number;
    displayName: string;
    imageMatch: boolean;
}

export type { IUpdateReviewPayload };
