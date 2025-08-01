import { ITimeLine } from "../../products/models/productDetails_model"

interface IOrder {
    __v: number
    _id: string
    createdAt: string
    deliveryAddress: string
    deliveryDetails: DeliveryDetails
    disabled: boolean
    orderId: string
    payment: Payment
    productOrders: ProductOrder[]
    progress: Progress
    updatedAt: string
    user: string
  }

  interface ProductOrder {
    _id: string
    order: string
    disabled: boolean
    orderId: string
    itemNo: number
    shop: string
    user: string
    product: Product
    quantity: number
    sku: string
    size: string
    color: string
    images: Image2[]
    bespokeColor: string
    bespokeInstruction: string
    bodyMeasurements: BodyMeasurement[]
    status: IStatus
    amount: Amount[]
    shopRevenue: ShopRevenue
    cancel: Cancel
    updatedAt: string
    createdAt: string
    __v: number
    confirmedAt: string
    deliveryCompany: any
    deliveryDate: string
    deliveryTrackingLink: any
    deliveryTrackingNumber: any
    expectedDeliveryDate: any
    expectedVendorCompletionDate: any
}
  
interface Product {
    _id: string
    productId: string
    productType: string
    disabled: boolean
    shopId: string
    title: string
    status: string
    currentStep: number
    categories: Categories
    description: string
    sizes: string[]
    postedBy: string
    shop: string
    timeLine: ITimeLine[]
    rejectionReasons: any[]
    colors: Color[]
    variations: Variation[]
    updatedAt: string
    createdAt: string
    __v: number
    bodyMeasurement: string
    promo: Promo
    autoPriceAdjustment: AutoPriceAdjustment
}
  
interface Categories {
    main: string[]
    style: string[]
    gender: string[]
    age: Age
    brand: string
    design: string[]
    occasion: string[]
    sleeveLength: string
    fastening: string[]
    fit: string[]
    productGroup: string
}
  
interface Age {
    ageGroup: string
}
  
// interface ITimeLine {
//     date: string
//     description: string
//     actionBy: string
//     _id: string
// }
  
interface Color {
    value: string
    images: Image[]
    _id: string
}
  
interface Image {
    link: string
    name: string
    isDefault: boolean
    _id: string
}
  
interface Variation {
    sku: string
    price: number
    colorValue: string
    size: string
    quantity: number
    bespoke: Bespoke
    _id: string
}
  
interface Bespoke {
    isBespoke: boolean
    colorType: string
    availableColors: string[]
}
  
interface Promo {
    promoId: string
    discountPercentage: number
}
  
interface AutoPriceAdjustment {
    isAdjustable: boolean
    adjustmentPercentage: number
}
  
interface Image2 {
    link: string
    name: string
    _id: string
}
  
interface BodyMeasurement {
    name: string
    measurements: Measurement[]
    _id: string
}
  
interface Measurement {
    _id: string
    field: string
    value: number
    unit: string
}
  
interface IStatus {
    name: string
    value: string
}
  
interface Amount {
    _id: string
    currency: string
    value: number
}
  
interface ShopRevenue {
    currency: string
    value: number
    status: string
    paidAt: any
}
  
interface Cancel {
    isCancelled: boolean
}
  
interface Payment {
    __v: number
    _id: string
    amount: number
    appliedVoucherAmount: number
    bank: string
    basket: string
    cardType: string
    channel: string
    countryCode: string
    createdAt: string
    currency: string
    deliveryFee: number
    email: string
    fees: number
    fullName: string
    gatewayResponse: string
    itemsTotal: number
    log: Log
    paidAt: string
    reference: string
    status: string
    total: number
    transactionDate: string
    updatedAt: string
    user: string
}
  
interface Log {
    start_time: number
    time_spent: number
    attempts: number
    errors: number
    success: boolean
    mobile: boolean
    input: any[]
    history: History[]
}
  
interface History {
    type: string
    message: string
    time: number
}
  
interface DeliveryDetails {
    _id: string
    address: string
    country: string
    firstName: string
    lastName: string
    phoneNumber: string
    region: string
}
  
interface Progress {
    value: number
    max: number
    min: number
}
  
export type { ProductOrder, Product, Categories, Age, Color, Image, Variation, Bespoke, Promo, AutoPriceAdjustment, Image2, BodyMeasurement, Measurement, IStatus, Amount, ShopRevenue, Cancel, Payment, Log, History, DeliveryDetails, Progress };
export default IOrder;