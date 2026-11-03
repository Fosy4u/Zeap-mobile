interface IHelpArticle {
    _id?:                 string;
    articleId?:           string;
    title?:               string;
    content?:             string;
    category?:            string;
    subCategory?:         string;
    markedIsHelpful?:     boolean;
    markedIsNotHelpful?:  boolean;
    createdAt?:           string;
    updatedAt?:           string;
};

export interface IHelpCategory {
    label: string;
    value: string;
};

export interface IHelpSubCategory {
    label:      string;
    value:      string;
    categories: string[];
};

export const HELP_CATEGORIES: IHelpCategory[] = [
    { label: "Buying", value: "customer" },
    { label: "Selling", value: "vendor" },
    { label: "My Account", value: "account" },
];

export const HELP_SUB_CATEGORIES: IHelpSubCategory[] = [
    { label: "Before Ordering", value: "beforeOrdering", categories: ["customer"] },
    { label: "Checkout and Payment", value: "checkoutAndPayment", categories: ["customer"] },
    { label: "Delivery and Shipping", value: "deliveryAndShipping", categories: ["customer", "vendor"] },
    { label: "Cancellations, Returns and Refunds", value: "returnsAndRefunds", categories: ["customer"] },
    { label: "Authentication & Quality Control", value: "authentication", categories: ["customer", "vendor"] },
    { label: "My Listings", value: "myListings", categories: ["vendor"] },
    { label: "Seller Ratings & Badges", value: "ratings", categories: ["vendor"] },
    { label: "Login and Security", value: "loginAndSecurity", categories: ["account"] },
    { label: "Alerts & Notifications", value: "notifications", categories: ["account"] },
    { label: "Security & Privacy", value: "privacy", categories: ["account"] },
    { label: "Account Support", value: "support", categories: ["account"] },
];

export const labelForCategory = (value?: string): string =>
    HELP_CATEGORIES.find((category) => category.value === value)?.label ?? "";

export const labelForSubCategory = (value?: string): string =>
    HELP_SUB_CATEGORIES.find((subCategory) => subCategory.value === value)?.label ?? "";

export default IHelpArticle;
