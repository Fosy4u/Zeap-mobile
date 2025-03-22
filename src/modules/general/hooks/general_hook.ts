import { useDispatch } from "react-redux";
import { useLazyGetProductOptionsQuery } from "../apis/general_api";
import { setAccessoriesOptions, setBespokeClothesOptions, setBespokeShoesOptions, setReadyMadeClothesOptions, setReadyMadeShoesOptions } from "../slices/general_slice";


/**
 * The useGeneralHook
 * @returns { handleGetProductOptions }
 */
const useGeneralHook = () => {
    // const { readyMadeClothesOptions, readyMadeShoesOptions, bespokeClothesOptions, bespokeShoesOptions, accessoriesOptions } = useSelector((state: RootState) => state.generalState);
    const [getProductOptions] = useLazyGetProductOptionsQuery();
    const dispatch = useDispatch();
    
    const handleGetProductOptions = async () => {
        try {
            const productOptions = await getProductOptions().unwrap();

            // Dispatch to Redux Store
            dispatch(setReadyMadeClothesOptions(productOptions.readyMadeClothes!));
            dispatch(setReadyMadeShoesOptions(productOptions.readyMadeShoes!));
            dispatch(setBespokeClothesOptions(productOptions.bespokeClothes!));
            dispatch(setBespokeShoesOptions(productOptions.bespokeShoes!));
            dispatch(setAccessoriesOptions(productOptions.accessories!));
            // console.log("PRODUCT OPTIONS::: ", productOptions.readyMadeClothes!.colorEnums);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    return {
        handleGetProductOptions,
    };
};

export default useGeneralHook;