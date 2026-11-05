import { useDispatch, useSelector } from "react-redux";
import currencies from "../../../utils/currencies.json";
import { setRecommendedCurrency } from "../slices/settingsState_slice";
import { RootState } from "../../../redux/store/store";

const defaultCurrency = currencies.find((currency) => currency.code === "NGN")!;

const useSettingsHook = () => {
  const { userData } = useSelector((state: RootState) => state.profileState);
  const { isLoading, loadingMessage } = useSelector((state: RootState) => state.settingsState);
  const dispatch = useDispatch();

  // Handle set recommended currency from the "prefferedCurrency" value in the user's details
  const handleSetRecommendedCurrency = () => {
    const prefferedCurrency = userData?.prefferedCurrency;

    if (prefferedCurrency) {
      const recommendedCurrency = currencies.find((currency) => currency.code === prefferedCurrency) ?? defaultCurrency;

      // Dispatch the recommended currency to the store
      dispatch(setRecommendedCurrency(recommendedCurrency));
    }
  }

  return {
    isLoading,
    loadingMessage,
    handleSetRecommendedCurrency,
  };
};

export default useSettingsHook;