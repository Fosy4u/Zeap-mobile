// Request body for PUT /order/reject
interface IOrderReject {
    productOrder_id: string;
    reason: string;
};

export default IOrderReject;
