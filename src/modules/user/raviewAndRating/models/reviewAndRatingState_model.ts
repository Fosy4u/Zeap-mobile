import IReview, { IGivenReview, IPendingReview, IReviewOrder } from "./review_model";

interface IReviewAndRatingState {
    tabs: string[];
    selectedTab: string;
    
    pendingReviews: IPendingReview[];
    givenReviews: IGivenReview[];
    reviewOrder: IReviewOrder | null;

    isLoading: boolean;
    loadingMessage: string;
};

export default IReviewAndRatingState; 