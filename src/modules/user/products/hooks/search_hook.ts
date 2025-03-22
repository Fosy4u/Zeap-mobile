import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLazySearchProductQuery } from "../apis/product_api";
import searchSchema, { ISearchProduct } from "../validations/search_validation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import {setAllProducts, setSearchWord} from "../slices/product_slice";
import {useState} from "react";



const useSearchHook = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const [searchProduct] = useLazySearchProductQuery();

    const handleSubmit =  async(title: string) => {
        setIsLoading(true);
        console.log("LOADING::: ", isLoading);

        const requestData = {
            title: title,
            limit: 20,
            pageNumber: 1
        };
        try {
            const products = await searchProduct(requestData).unwrap();
            if (products) {
                dispatch(setAllProducts(products));
                setIsLoading(false);
            }
        } catch (error) {
            console.log("ERROR::: ", error);
            setIsLoading(false)
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSubmit, isLoading };
};

export default useSearchHook;