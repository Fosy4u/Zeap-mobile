import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import useDisplayCurrency from "../../../general/hooks/displayCurrency_hook";

const useShopCurrency = () => {
    const { shop } = useSelector((state: RootState) => state.vendorGeneralState);
    const { product } = useSelector((state: RootState) => state.vendorProductState);
    const { currencySymbol } = useDisplayCurrency();

    const entrySymbol = product?.currency?.symbol || shop?.currency?.symbol || currencySymbol();

    return { entrySymbol };
};

export default useShopCurrency;
