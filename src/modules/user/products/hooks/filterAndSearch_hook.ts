
import { Alert } from "react-native";
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
      const { searchPhrase, currentPage, dynamicFilterOptions } = useSelector((state: RootState) => state.productState);
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
    const handleGetDynamicFilterOptions = async (queryParams: any) => {
        dispatch(setLoadingMessage("Getting filter options..."));
        dispatch(setIsLoading(true));
        
        try {
            const dynamicFilterOptions = await getDynamicFilterOptions({queryParams}).unwrap();

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

    // Format the user-selected dynamic filters into API params (lowercase the
    // key, strip spaces, camel-case productType values, join arrays as CSV).
    const buildFormattedFilters = (): Record<string, string | number> => {
        const formattedFilters: Record<string, string | number> = {};
        Object.keys(selectedFilters).forEach((eachKey) => {
            let formattedKey = eachKey.charAt(0).toLowerCase() + eachKey.slice(1);
            formattedKey = formattedKey.replace(/\s+/g, '');

            const values = selectedFilters[eachKey];
            let joinedValues: string | number;
            if (formattedKey === 'productType' && Array.isArray(values)) {
                joinedValues = values.map(val => {
                    const strVal = val as string;
                    return strVal.split(' ').map((word, index) =>
                        index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join('');
                }).join(',');
            } else {
                joinedValues = Array.isArray(values) ? values.join(',') : values;
            }
            formattedFilters[formattedKey] = joinedValues;
        });
        return formattedFilters;
    };

    // Map a category screen to its backend filter. Female/Male filter by the
    // dedicated `gender` param (a product's gender lives in categories.gender —
    // filtering by `main` matched nothing and leaked the whole catalogue).
    // Shoes/Accessories are real `main` categories.
    const categoryFilterFor = (screenTitle: string): Record<string, string> => {
        switch (screenTitle) {
            case "Female Clothings":  return { gender: "Female" };
            case "Male Clothings":    return { gender: "Male" };
            case "Shoes":             return { main: "Footwear" };
            case "Accessories":
            case "Bags":              return { main: "Accessories" };
            // Bespoke vs ready-to-wear are distinguished by productType, not a
            // category/gender. Sent as a CSV the backend filters on.
            case "Bespoke Collection": return { productType: "bespokeCloth,bespokeShoe" };
            case "Ready to Wear":      return { productType: "readyMadeCloth,readyMadeShoe,accessory" };
            default:                   return {};
        }
    };

    // Normalize a dynamic-filter group name to its API param key — mirrors the
    // transform in buildFormattedFilters (lowercase first char, strip spaces).
    const toParamKey = (name: string) => (name.charAt(0).toLowerCase() + name.slice(1)).replace(/\s+/g, '');

    // Pre-select the category's filter (e.g. Gender → Male) in the dynamic filter
    // sheet. Keyed by the REAL backend group name + option value (matched against
    // the loaded dynamicFilterOptions) so the chip highlights correctly and
    // buildFormattedFilters still produces the right param. Idempotent per option.
    const preselectCategoryFilters = (screenTitle: string) => {
        const desired = categoryFilterFor(screenTitle);
        if (Object.keys(desired).length === 0) return;

        setSelectedFilters((prev) => {
            const next = { ...prev };
            Object.entries(desired).forEach(([paramKey, paramValue]) => {
                const group = (dynamicFilterOptions || []).find((g: any) => toParamKey(g?.name || "") === paramKey);
                const options: any[] = Array.isArray(group?.options) ? (group!.options as any[]) : [];
                const matched = options.find((o) => String(o?.value).toLowerCase() === String(paramValue).toLowerCase());
                // Only seed a chip when it maps to a REAL filter option (e.g.
                // Gender → Male). Multi-value category filters (e.g. the bespoke /
                // ready-to-wear productType CSV) won't match a single option — we
                // skip those here; the list is still filtered via categoryFilterFor.
                if (group?.name && matched?.value !== undefined) {
                    const groupName = group.name;
                    const optionValue = matched.value as string | number;
                    if (!Array.isArray(next[groupName]) || !next[groupName].includes(optionValue)) {
                        next[groupName] = [optionValue];
                    }
                }
            });
            return next;
        });
    };

    // Total number of individually-selected filter options (drives the badge).
    const selectedFiltersCount = Object.values(selectedFilters).reduce(
        (sum, values) => sum + (Array.isArray(values) ? values.length : 0), 0,
    );

    // Handle get filtered products
    const handleGetFilteredProducts = async({ screenTitle, setShowBottomSheetModal }: { screenTitle: string; setShowBottomSheetModal?: (value: boolean) => void }) => {
        dispatch(setLoadingMessage(`Getting ${screenTitle.toLowerCase()}...`));
        dispatch(setIsLoading(true));
        // Any new filter/category load starts from page 1.
        dispatch(setCurrentPage(1));

        const formattedFilters = { ...buildFormattedFilters(), ...categoryFilterFor(screenTitle) };

        const queryParams = {
            ...formattedFilters,
            limit: 20,
            pageNumber: 1
        };

        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle }).unwrap();

            if (productResponse) {
                dispatch(setAllProducts(productResponse));
                await handleGetDynamicFilterOptions({...formattedFilters});

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
    const handleGetPopularProducts = async (screenTitle: string) => {
        dispatch(setLoadingMessage("Getting popular products..."));
        dispatch(setPopularPeoductsIsLoading(true));

        const queryParams = {
            limit: 20,
            pageNumber: 1
        };
        // "Popular Products"
        
        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            // console.log("POPULAR PRODUCTS::: ", productResponse);

            if (productResponse) {
                dispatch(setPopularProducts(productResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setPopularPeoductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get newest products
    const handleGetNewestProducts = async (screenTitle: string) => {
        dispatch(setLoadingMessage("Getting newest products..."));
        dispatch(setNewestProductsIsLoading(true));

        const queryParams = {
            limit: 20,
            pageNumber: 1
        };
        // "Newest Products"
        
        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            // console.log("NEWEST PRODUCTS::: ", productResponse);

            if (productResponse) {
                dispatch(setNewestProducts(productResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setNewestProductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get recently viewed products
    const handleGetRecentlyViewedProducts = async (screenTitle: string) => {
        dispatch(setLoadingMessage("Getting recently viewed products..."));
        dispatch(setRecentlyViewedProductsIsLoading(true));
        
        const queryParams = {
            limit: 20,
            pageNumber: 1
        };
        // "Recently Viewed"

        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            // console.log("RECENTLY VIEWED PRODUCTS::: ", productResponse);

            if (productResponse) {
                dispatch(setRecentlyViewedProducts(productResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setRecentlyViewedProductsIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Get recommended products
    const handleGetRecommendedProducts = async (screenTitle: string) => {
        dispatch(setLoadingMessage("Getting recommended products..."));
        dispatch(setRecommendedProductsIsLoading(true));

        const queryParams = {
            limit: 20,
            pageNumber: 1
        };
        // "Recommended Products"
        
        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            // console.log("RECOMMENDED PRODUCTS::: ", productResponse);

            if (productResponse) {
                dispatch(setRecommendedProducts(productResponse));
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
            const productResponse = await getFilteredProducts({queryParams, screenTitle}).unwrap();
            // console.log("FILTERED PRODUCTS::: ", productResponse);

            if (productResponse) {
                dispatch(setAllProducts(productResponse));
                await handleGetDynamicFilterOptions({search: searchPhrase});
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
        // Already at the first page — nothing before it.
        if (direction === "Prev" && currentPage <= 1) return;

        const newPageNumber = direction === "Next" ? currentPage + 1 : currentPage - 1;

        dispatch(setLoadingMessage(`Fetching ${direction === "Next" ? "next" : "previous"} product page...`));
        dispatch(setIsLoading(true));

        // Carry the SAME filters + category across pages. Previously this sent
        // only { limit, pageNumber }, which dropped the gender/category filter so
        // page 2+ returned the entire catalogue.
        const queryParams = {
            ...buildFormattedFilters(),
            ...categoryFilterFor(screenTitle),
            limit: 20,
            pageNumber: newPageNumber,
        };

        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle}).unwrap();

            // End-of-list guard: an empty Next means there's no further page.
            // Keep the current list/page instead of blanking the screen with a
            // misleading "no product" empty state.
            if (direction === "Next" && (!productResponse || productResponse.length === 0)) {
                Alert.alert("End of list", "You've reached the last page of products.");
                return;
            }

            dispatch(setCurrentPage(newPageNumber));
            if (productResponse) {
                dispatch(setAllProducts(productResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({});
        navigation.setParams({screenTitle: 'All Products'});
    };

    return {
        selectedFilters, selectedFiltersCount, toggleCheckboxOption, preselectCategoryFilters, handleGetDynamicFilterOptions,
        handleSubmit, handleGetFilteredProducts, handleGetPromoProducts, handleGetPopularProducts, handleGetNewestProducts,
        handleGetRecentlyViewedProducts, handleGetRecommendedProducts, handlePrevAndNextPagination, clearAllFilters,
    };
};

export default useFilterAndSearchHook;
