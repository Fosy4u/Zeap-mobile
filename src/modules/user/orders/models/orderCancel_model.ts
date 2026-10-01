// Request body for PUT /order/cancel
interface IOrderCancel {
    productOrder_id: string;
    reason: string;
};

export default IOrderCancel;
