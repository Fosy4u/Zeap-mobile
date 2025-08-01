import IPoint from "./point_model";
import IVoucher from "./voucher_model";

interface IPointAndVoucherState {
    tabs: string[];
    points: IPoint;
    selectedTab: string;
    activeVouchers: IVoucher[];
    inactiveVouchers: IVoucher[];
    selectedVoucher: IVoucher;
    selectedVoucherType: string;
    showVoucherDetailBottomSheet: boolean;
    isLoading: boolean;
    loadingMessage: string;
};

export default IPointAndVoucherState;