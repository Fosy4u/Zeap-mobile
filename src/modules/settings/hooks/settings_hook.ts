import { useDispatch, useSelector } from "react-redux";
import currencies from "../../../utils/currencies.json";
import handleError from "../../general/hooks/errorHandler_hook";
import { 
    setIsLoading, 
    setLoadingMessage, 
    setRecommendedCurrency,
} from "../slices/settingsState_slice";
import { useLazyGetCountryCurrencyQuery } from "../apis/settings_api";
import { RootState } from "../../../redux/store/store";
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema, IChangePassword } from "../validations/changePassword_validation";

const defaultCurrency = currencies.find((currency) => currency.code === "NGN")!;

const useSettingsHook = () => {
  const { userData } = useSelector((state: RootState) => state.profileState);
  const { 
    isLoading, 
    loadingMessage, 
    showCurrentPassword, 
    showNewPassword, 
    showConfirmNewPassword 
  } = useSelector((state: RootState) => state.settingsState);
  const dispatch = useDispatch();

  // Change Password Form
  const { control, handleSubmit, formState: { errors } } = useForm<IChangePassword>({
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    },
    resolver: yupResolver(changePasswordSchema)
  });

  const onSubmit = (data: IChangePassword) => {
    console.log('Change password data:', data);
    // Handle password change logic here
  };

  const [getCountryCurrency] = useLazyGetCountryCurrencyQuery();


  // Function to request location permission
  const requestLocationPermission = async () => {
        dispatch(setLoadingMessage("Fetching country currency..."));
        dispatch(setIsLoading(true));
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission granted");
        } else {
          console.log("Location permission denied");
        }
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // console.log("CURRENT LOCATION::", latitude, longitude);

          // Call the API to get the currency based on location
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          // const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`

          handleGetCountryCurrency(url);
        },
        (error) => {
          console.warn("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      )
    } catch (err) {
      console.warn(err);
    }
  };


  // Handle get country's currency
  const handleGetCountryCurrency = async (url: string) => {
      try {
          
        const countryCurrencyResponse = await getCountryCurrency({ url }).unwrap();
        // console.log("COUNTRY CURRENCY RESPONSE::", countryCurrencyResponse);  
        
        if (countryCurrencyResponse) {
          const country = countryCurrencyResponse.address.country;
          const recommendedCurrency = currencies.find((currency) => currency.country === country) ?? defaultCurrency;

          // Dispatch the recommended currency to the store
          dispatch(setRecommendedCurrency(recommendedCurrency));
        }
      } catch (error) {
          handleError(error);            
      } finally {
          dispatch(setIsLoading(false));
          dispatch(setLoadingMessage(""));
      }
  };

  // Handle set recommended currency from the "prefferedCurrency" value in the user's details
  const handleSetRecommendedCurrency = () => {
    const prefferedCurrency = userData?.prefferedCurrency;

    if (prefferedCurrency) {
      const recommendedCurrency = currencies.find((currency) => currency.code === prefferedCurrency) ?? defaultCurrency;
      console.log("CURRENCY DETAILS:::", recommendedCurrency);

      // Dispatch the recommended currency to the store
      dispatch(setRecommendedCurrency(recommendedCurrency));
    }
  }

  return {
    control, 
    handleSubmit, 
    onSubmit, 
    errors, 
    isLoading,
    loadingMessage,
    // Password visibility state
    showCurrentPassword,
    showNewPassword,
    showConfirmNewPassword,
    // Other handlers
    handleGetCountryCurrency,
    handleSetRecommendedCurrency,
  };
};

export default useSettingsHook;