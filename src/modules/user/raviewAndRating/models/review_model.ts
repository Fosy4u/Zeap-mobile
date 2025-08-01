
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
};

interface IReviewImage {
    link: string;
    name: string;
    _id: string;
};

export type { IGivenReview, IPendingReview, IReviewOrder, IReviewImage };
export default IReview; 