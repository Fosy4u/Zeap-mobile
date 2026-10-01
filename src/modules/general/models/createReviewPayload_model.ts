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

/* Body of PUT /review/update — the review is addressed by `review_id`, and the
   product still travels with it. */
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
