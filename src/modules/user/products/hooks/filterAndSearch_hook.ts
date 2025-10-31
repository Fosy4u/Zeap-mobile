
import { useLazyGetDynamicFilterOptionsQuery, useLazyGetFilteredProductsQuery, useLazyGetPromoProductsQuery } from "../apis/product_api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import {setAllProducts, setDynamicFilterOptions, setIsLoading, setLoadingMessage, setNewestProductsIsLoading, setNewestProducts, setPopularPeoductsIsLoading, setPopularProducts, setPromoProductsIsLoading, setPromoProducts, setRecentlyViewedProducts, setRecentlyViewedProductsIsLoading, setRecommendedProductsIsLoading, setRecommendedProducts, setSearchPhrase, setCurrentPage} from "../slices/product_slice";
import {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import handleError from "../../../general/hooks/errorHandler_hook";


const useFilterAndSearchHook = () => {
      const { searchPhrase, currentPage } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch<AppDispatch>();
    const [selectedFilters, setSelectedFilters] = useState<Record<string, (string | number)[]>>({});

    // Import API hooks
    const [getDynamicFilterOptions] = useLazyGetDynamicFilterOptionsQuery();
    const [getFilteredProducts] = useLazyGetFilteredProductsQuery();
    const [getPromoProducts] = useLazyGetPromoProductsQuery();

    // Toggle checkbox option
    const toggleCheckboxOption = (filterName: string, optionValue: string | number) => {
        setSelectedFilters((prev) => {
            const current = prev[filterName] || [];
            const isSelected = current.includes(optionValue);
            console.log("FILE NAME::: ", filterName);
            console.log("OPTION VALUE::: ", optionValue);

            // Filter logic: if item is selected, remove it; if not, add it
            const updated = isSelected
                ? current.filter((value: string | number) => value !== optionValue)
                : [...current, optionValue];


            const selectedFilter = {
                ...prev,
                [filterName]: updated
            };
            console.log("SELECTED FILTER::: ", selectedFilter);

            return selectedFilter;
        });
    };

    // Handle get dynamic filter options
    const handleGetDynamicFilterOptions = async () => {
        dispatch(setLoadingMessage("Getting filter options..."));
        dispatch(setIsLoading(true));
        
        try {
            const dynamicFilterOptions = await getDynamicFilterOptions().unwrap();
            // console.log("DYNAMIC FILTER OPTIONS::: ", dynamicFilterOptions);

            if (dynamicFilterOptions) {
                dispatch(setDynamicFilterOptions(dynamicFilterOptions));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get filtered products
    const handleGetFilteredProducts = async({ screenTitle, setShowBottomSheetModal }: { screenTitle: string; setShowBottomSheetModal?: (value: boolean) => void }) => {
        dispatch(setLoadingMessage(`Getting ${screenTitle.toLowerCase()}...`));
        dispatch(setIsLoading(true));
        
        // Format selected filters to match API expected params
        const formattedFilters: Record<string, (string | number)> = {};
        Object.keys(selectedFilters).forEach((eachKey) => {
            // Convert first letter to lowercase e.g., "Product Type" to "product Type"
            let formattedKey = eachKey.charAt(0).toLowerCase() + eachKey.slice(1);

            // Remove spaces from key names e.g., "product Type" to "productType"
            formattedKey = formattedKey.replace(/\s+/g, '');

            // Join array values as comma-separated string
            const values = selectedFilters[eachKey];
            formattedFilters[formattedKey] = Array.isArray(values) ? values.join(',') : values;
        });

        const queryParams = {
            ...formattedFilters,
            limit: 5,
            pageNumber: 1
        };
        console.log("REQUEST DATA::: ", queryParams);

        try {
        const data = await getFilteredProducts({queryParams, screenTitle }).unwrap();
            // console.log("FILTERED PRODUCTS::: ", data.products);
            // console.log("FILTERED DYNAMIC OPTIONS::: ", data.dynamicFilters);

            if (data) {
                const products = data.products;
                const dynamicFilters = data.dynamicFilters;

                dispatch(setAllProducts(products));
                dispatch(setDynamicFilterOptions(dynamicFilters));
                if (setShowBottomSheetModal) {
                    setShowBottomSheetModal(false);
                }
            }
        } catch (error) {
            handleError(error);
            console.log("ERROR (FILTERED PRODUCTS)::: ", error);
            
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get promo products
    const handleGetPromoProducts = async () => {
        dispatch(setLoadingMessage("Getting promo products..."));
        dispatch(setPromoProductsIsLoading(true));
        
        try {
            const promoProducts = await getPromoProducts().unwrap();
            // console.log("PROMO PRODUCTS::: ", promoProducts);

            if (promoProducts.length > 0) {
                dispatch(setPromoProducts(promoProducts));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setPromoProductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get popular products
    const handleGetPopularProducts = async () => {
        dispatch(setLoadingMessage("Getting popular products..."));
        dispatch(setPopularPeoductsIsLoading(true));

        const queryParams = {
            limit: 20,
            pageNumber: 1
        };
        
        try {
            const data = await getFilteredProducts({queryParams, screenTitle: "Popular Products"}).unwrap();
            // console.log("POPULAR PRODUCTS::: ", data.products);

            if (data) {
                const products = data.products;
                dispatch(setPopularProducts(products));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setPopularPeoductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get newest products
    const handleGetNewestProducts = async () => {
        dispatch(setLoadingMessage("Getting newest products..."));
        dispatch(setNewestProductsIsLoading(true));

        const queryParams = {
            limit: 20,
            pageNumber: 1
        };
        
        try {
            const data = await getFilteredProducts({queryParams, screenTitle: "Newest Products"}).unwrap();
            // console.log("NEWEST PRODUCTS::: ", data.products);

            if (data) {
                const products = data.products;
                dispatch(setNewestProducts(products));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setNewestProductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get recently viewed products
    const handleGetRecentlyViewedProducts = async () => {
        dispatch(setLoadingMessage("Getting recently viewed products..."));
        dispatch(setRecentlyViewedProductsIsLoading(true));
        
        try {
            const data = await getFilteredProducts({queryParams: { limit: 20, pageNumber: 1 }, screenTitle: "Recently Viewed"}).unwrap();
            // console.log("RECENTLY VIEWED PRODUCTS::: ", data.products);

            if (data) {
                const products = data.products;
                dispatch(setRecentlyViewedProducts(products));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setRecentlyViewedProductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get recommended products
    const handleGetRecommendedProducts = async () => {
        dispatch(setLoadingMessage("Getting recommended products..."));
        dispatch(setRecommendedProductsIsLoading(true));
        
        try {
            const data = await getFilteredProducts({queryParams: { limit: 20, pageNumber: 1 }, screenTitle: "Recommended Products"}).unwrap();
            // console.log("RECOMMENDED PRODUCTS::: ", data.products);

            if (data) {
                const products = data.products;
                dispatch(setRecommendedProducts(products));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setRecommendedProductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle search product
    const handleSubmit =  async(screenTitle: string) => {
        dispatch(setLoadingMessage(`Searching for "${searchPhrase.toLowerCase()}"...`));
        dispatch(setIsLoading(true));

        const queryParams = {
            search: searchPhrase,
            limit: 20,
            pageNumber: 1
        };
        console.log("REQUEST DATA::: ", queryParams);

        try {
            const data = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            // console.log("FILTERED PRODUCTS::: ", data.products);
            // console.log("FILTERED DYNAMIC OPTIONS::: ", data.dynamicFilters);

            if (data) {
                const products = data.products;
                const dynamicFilters = data.dynamicFilters;

                dispatch(setAllProducts(products));
                dispatch(setDynamicFilterOptions(dynamicFilters));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
            dispatch(setSearchPhrase(""));
        }
    };

    // Handle prev and next pagination
    const handlePrevAndNextPagination = async({screenTitle, direction}: {screenTitle: string, direction: string}) => {
        dispatch(setLoadingMessage(`Fetching ${direction === "Next" ? "next" : "previous"} product page...`));
        dispatch(setIsLoading(true));
        let newPageNumber = currentPage;

        if (direction === "Next") {
            newPageNumber += 1;
        } else if (direction === "Prev" && currentPage > 1) {
            newPageNumber -= 1;
        }

        // Update current page in the state
        dispatch(setCurrentPage(newPageNumber));

        // Fetch products for the new page
        const queryParams = {
            limit: 20,
            pageNumber: newPageNumber,
        };
        // console.log("QUERY PARAMS::: ", queryParams);
        
        try {
            const data = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            if (data) {
                const products = data.products;
                dispatch(setAllProducts(products));
            }
        } catch (error) {
            handleError(error);
        }
    };


    return {
        selectedFilters, toggleCheckboxOption, handleGetDynamicFilterOptions,
        handleSubmit, handleGetFilteredProducts, handleGetPromoProducts, handleGetPopularProducts, handleGetNewestProducts,
        handleGetRecentlyViewedProducts, handleGetRecommendedProducts, handlePrevAndNextPagination,
    };
};

export default useFilterAndSearchHook;