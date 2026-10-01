import { IStatus } from "../models/orderDetails_model";
import { canCancelOrderAtStatus, NON_CANCELLABLE_STATUSES } from "../../../../utils/orderLifecycle";

/* Cut-off lives in the shared lifecycle helper so the buyer and the vendor
   close cancellation at the same stage the web app does — quality check. */
const canCancelOrderStatus = (status?: IStatus): boolean =>
    /* Unknown status disables the button: wrongly offering to cancel a
       delivered item is worse than making the buyer reopen the sheet. */
    canCancelOrderAtStatus(status, false);

export { canCancelOrderStatus, NON_CANCELLABLE_STATUSES };
