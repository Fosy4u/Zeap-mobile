import { useDispatch, useSelector } from "react-redux";
import { useDecreamentProductQuantityMutation, useIncreamentProductQuantityMutation, useLazyGetCartQuery, useLazyGetDeliveryDateQuery, useLazyGetDeliveryMethodQuery, useLazyGetOrderSummaryQuery, useRemoveProductFromCartMutation } from "../apis/cart_api";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import { setCart, setDeliveryDates, setDeliveryMethod, setIsLoading, setLoadingMessage, setOrderSummary, setSelectedDeliveryFee } from "../slices/cart_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import IDeliveryDate from "../models/deliveryDate_model";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";


const useCartHook = () => {
    const { selectedDeliveryFee, deliveryDates } = useSelector((state: RootState) => state.cartState);
    const { userData } = useSelector((state: RootState) => state.profileState );
    const { selectedAddress } = useSelector((state: RootState) => state.addressState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();

    const [getCart] = useLazyGetCartQuery();
    const [increamentProductQuantity] = useIncreamentProductQuantityMutation();
    const [decreamentProductQuantity] = useDecreamentProductQuantityMutation();
    const [removeProductFromCart] = useRemoveProductFromCartMutation();
    const [getOrderSummary] = useLazyGetOrderSummaryQuery();
    const [getDeliveryMethod] = useLazyGetDeliveryMethodQuery();
    const [getDeliveryDate] = useLazyGetDeliveryDateQuery()
;
    // Handle get carts
    const handleGetCarts = async () => {
        try {
            dispatch(setLoadingMessage("Fetching cart items..."));
            dispatch(setIsLoading(true));

            const cartsResponse = await getCart().unwrap();
            
            if (cartsResponse) {    
                dispatch(setCart(cartsResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };
    
    const handleIncreamentProductQuantity = async (_id: string) => {
        dispatch(setLoadingMessage("Updating quantity..."));
        dispatch(setIsLoading(true));

        try {
            await increamentProductQuantity(_id).unwrap();
            await handleGetCarts();
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };
    
    const handleDecreamentProductQuantity = async (_id: string) => {
        dispatch(setLoadingMessage("Updating quantity..."));
        dispatch(setIsLoading(true));

        try {
            await decreamentProductQuantity(_id).unwrap();
            await handleGetCarts();
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const handleRemoveProductFromCart = async (_id: string) => {
        dispatch(setLoadingMessage("Removing item..."));
        dispatch(setIsLoading(true));

        try {            
            await removeProductFromCart(_id).unwrap();
            await handleGetCarts();
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get delivery method
    const handleGetDeliveryMethod = async () => {
        dispatch(setLoadingMessage("Fetching delivery methods..."));
        dispatch(setIsLoading(true));

        const requestParams = {
            country: selectedAddress?.country || "Nigeria",
        }

        try {
            const getDeliveryMethodResponse = await getDeliveryMethod(requestParams).unwrap();

            if (getDeliveryMethodResponse) {
                dispatch(setDeliveryMethod(getDeliveryMethodResponse));
                dispatch(setSelectedDeliveryFee(getDeliveryMethodResponse.deliveryFees[0]));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    }

    // Handle get order summary
    const handleGetOderSummary = async () => {
        dispatch(setLoadingMessage("Fetching order summary..."));
        dispatch(setIsLoading(true));

        const requestParams = {
            country: selectedAddress?.country || "Nigeria",
            method: selectedDeliveryFee?.method || "standard",
        };

        try {
            const orderSummaryResponse = await getOrderSummary(requestParams).unwrap();

            if (orderSummaryResponse) {
                dispatch(setOrderSummary(orderSummaryResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };


    // Handle get delivery date
    const handleGetDeliveryDate = async () => {
        dispatch(setLoadingMessage("Fetching delivery date..."));
        dispatch(setIsLoading(true));

        const requestParams = {
            country: selectedAddress?.country || "Nigeria",
            method: selectedDeliveryFee?.method || "standard",
        };

        try {
            const deliveryDateResponse = await getDeliveryDate(requestParams).unwrap();

            if (deliveryDateResponse) {
                dispatch(setDeliveryDates(deliveryDateResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get item's delivery period
    // Add this interface above the useCartHook definition or import it from the correct file
    const getItemDeliveryPeriod = (sku: string, deliveryType: string) => {
        if (!deliveryDates || !Array.isArray(deliveryDates) || deliveryDates.length === 0) {
            return "N/A";
        }

        
        // Find the delivery period for the given SKU and delivery type
        const deliveryPeriod = deliveryDates.find((date: IDeliveryDate) => date.sku === sku);
        
        if (deliveryPeriod) {
            // Check if item is 'standardDeliveryDate' or 'expressDeliveryDate'
            const deliveryDatesKey: keyof Pick<IDeliveryDate, "standardDeliveryDate" | "expressDeliveryDate"> = 
                deliveryType === "Standard" ? "standardDeliveryDate" : "expressDeliveryDate";
    
            if (deliveryPeriod[deliveryDatesKey]) {
                return `${deliveryPeriod[deliveryDatesKey]?.min} - ${deliveryPeriod[deliveryDatesKey]?.max}`;
            }
        }
    };

    return {
        handleGetCarts,
        handleIncreamentProductQuantity,
        handleDecreamentProductQuantity,
        handleRemoveProductFromCart,
        handleGetDeliveryMethod,
        handleGetOderSummary,
        handleGetDeliveryDate,
        getItemDeliveryPeriod,
    };
};

export default useCartHook;