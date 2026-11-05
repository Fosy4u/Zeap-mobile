import { IStatus } from "../models/orderDetails_model";
import { canCancelOrderAtStatus, NON_CANCELLABLE_STATUSES } from "../../../../utils/orderLifecycle";

const canCancelOrderStatus = (status?: IStatus): boolean =>
    canCancelOrderAtStatus(status, false);

export { canCancelOrderStatus, NON_CANCELLABLE_STATUSES };
