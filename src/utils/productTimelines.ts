// Shared product delivery timelines, keyed by product type. Used by the buyer
// product-details Timeline tab (and available to vendor screens too). Each step
// is a { title, description }; pick the right list with getProductTimeline().

export interface ITimelineStep {
    title: string;
    description: string;
}

// Accessories (eyewear, watches, bags…)
export const accessoriesTimeline: ITimelineStep[] = [
    { title: "Place Order", description: "Select the preferred accessory and place the order." },
    { title: "Order Confirmation", description: "Order details and product availability are confirmed." },
    { title: "Order Processing", description: "The item is prepared for shipment." },
    { title: "Quality Check", description: "The accessory is inspected to meet quality standards." },
    { title: "Dispatch", description: "The order is packaged and dispatched." },
    { title: "Delivery", description: "The item is delivered to the specified location." },
    { title: "Feedback", description: "Customer feedback is collected." },
];

// Ready-to-wear clothes
export const readyToWearClothesTimeline: ITimelineStep[] = [
    { title: "Select & Place Order", description: "Choose the preferred style, color, and size, then submit the order." },
    { title: "Order Confirmation", description: "Product availability and order details are verified." },
    { title: "Order Processing", description: "The item is selected and prepared for packaging." },
    { title: "Quality Check", description: "The item is inspected for quality, size accuracy, and defects." },
    { title: "Dispatch", description: "The order is packaged and shipped." },
    { title: "Delivery", description: "The item arrives at the specified address." },
    { title: "Feedback", description: "Customer feedback is collected." },
];

// Ready-to-wear footwear
export const readyToWearFootwearTimeline: ITimelineStep[] = [
    { title: "Place Order", description: "Select the preferred footwear style and size, then submit the order." },
    { title: "Order Confirmation", description: "Product availability and order details are confirmed." },
    { title: "Order Processing", description: "The order is prepared and packaged for delivery." },
    { title: "Quality Check", description: "The footwear is inspected to ensure it meets quality standards." },
    { title: "Dispatch", description: "The footwear is dispatched to the specified location." },
    { title: "Delivery", description: "The product is delivered to the specified location." },
    { title: "Feedback", description: "Customer feedback is collected." },
];

// Bespoke clothes
export const bespokeClothesTimeline: ITimelineStep[] = [
    { title: "Submit Measurements & Place Order", description: "Body measurements are submitted while placing the order online." },
    { title: "Order Confirmation", description: "Order details, body measurements, design preferences, and material selections are confirmed." },
    { title: "Cutting", description: "The material is cut according to the submitted body measurements." },
    { title: "Sewing", description: "The item is sewn to match the approved body measurements." },
    { title: "Quality Check", description: "The finished item is inspected for quality and measurement accuracy." },
    { title: "Dispatch", description: "The item is dispatched to the specified location." },
    { title: "Delivery", description: "The bespoke product is delivered to the specified location." },
    { title: "Feedback", description: "Customer feedback is collected." },
];

// Bespoke footwear
export const bespokeFootwearTimeline: ITimelineStep[] = [
    { title: "Place Order", description: "Footwear measurements are submitted while placing the order online." },
    { title: "Order Confirmation & Measurements", description: "Order details, foot measurements, design preferences, and material selections are confirmed." },
    { title: "Cutting", description: "The materials are cut according to the approved measurements and design specifications." },
    { title: "Sewing & Assembly", description: "The footwear is sewn and assembled to match the confirmed specifications." },
    { title: "Quality Check", description: "The finished footwear is inspected for comfort, durability, and design accuracy." },
    { title: "Dispatch", description: "The order is carefully packaged and dispatched." },
    { title: "Delivery", description: "The product is delivered to the specified location." },
    { title: "Feedback", description: "Customer feedback is collected." },
];

// Resolve the timeline for a given product type. Falls back to ready-to-wear
// clothes for any unrecognised type.
export const getProductTimeline = (productType?: string): ITimelineStep[] => {
    switch (productType) {
        case "accessory":      return accessoriesTimeline;
        case "readyMadeCloth": return readyToWearClothesTimeline;
        case "readyMadeShoe":  return readyToWearFootwearTimeline;
        case "bespokeCloth":   return bespokeClothesTimeline;
        case "bespokeShoe":    return bespokeFootwearTimeline;
        default:               return readyToWearClothesTimeline;
    }
};
