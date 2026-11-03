
import { useLazyGetDynamicFilterOptionsQuery, useLazyGetFilteredProductsQuery, useLazyGetPromoProductsQuery } from "../apis/product_api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import {setAllProducts, setDynamicFilterOptions, setIsLoading, setLoadingMessage, setNewestProductsIsLoading, setNewestProducts, setPopularPeoductsIsLoading, setPopularProducts, setPromoProductsIsLoading, setPromoProducts, setRecentlyViewedProducts, setRecentlyViewedProductsIsLoading, setRecommendedProductsIsLoading, setRecommendedProducts, setSearchPhrase, setCurrentPage, setProductsTotalCount} from "../slices/product_slice";
import {useState} from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import handleError from "../../../general/hooks/errorHandler_hook";
import buildFilterParams from "../utils/buildFilterParams";

// Map a category screen to its backend filter. Female/Male filter by the
// dedicated `gender` param (a product's gender lives in categories.gender —
// filtering by `main` matched nothing and leaked the whole catalogue).
// Shoes/Accessories are real `main` categories.
export const categoryFilterFor = (screenTitle: string): Record<string, string> => {
    switch (screenTitle) {
        case "Women":             return { gender: "Female" };
        case "Men":               return { gender: "Male" };
        case "Shoes":             return { main: "Footwear" };
        case "Accessories":       return { main: "Accessories" };
        case "Bags":              return { accessoryType: "Bag" };
        // Bespoke vs ready-to-wear are distinguished by productType, not a
        // category/gender. Sent as a CSV the backend filters on.
        case "Bespoke Collection": return { productType: "bespokeCloth,bespokeShoe" };
        case "Ready to Wear":      return { productType: "readyMadeCloth,readyMadeShoe,accessory" };
        default:                   return {};
    }
};

export const PAGE_SIZE = 20;

export const getTotalPages = (totalCount: number | null) =>
    totalCount === null ? null : Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

const useFilterAndSearchHook = () => {
      const { searchPhrase, currentPage, dynamicFilterOptions, allProducts, productsTotalCount } = useSelector((state: RootState) => state.productState);
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
    const handleGetDynamicFilterOptions = async (queryParams: any, trackTotalCount = false) => {
        dispatch(setLoadingMessage("Getting filter options..."));
        dispatch(setIsLoading(true));
        
        try {
            const { dynamicFilters, totalCount } = await getDynamicFilterOptions({queryParams}).unwrap();

            if (dynamicFilters) {
                dispatch(setDynamicFilterOptions(dynamicFilters));
            }
            if (trackTotalCount) {
                dispatch(setProductsTotalCount(totalCount));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    const buildFormattedFilters = (): Record<string, string | number> =>
        buildFilterParams(
            selectedFilters as Record<string, (string | number)[]>,
            (dynamicFilterOptions as any) || [],
        );

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
    const handleGetFilteredProducts = async({ screenTitle, filters = {}, source, setShowBottomSheetModal }: { screenTitle: string; filters?: Record<string, string>; source?: string; setShowBottomSheetModal?: (value: boolean) => void }) => {
        dispatch(setLoadingMessage(`Getting ${screenTitle.toLowerCase()}...`));
        dispatch(setIsLoading(true));
        dispatch(setAllProducts([]));
        // Any new filter/category load starts from page 1.
        dispatch(setCurrentPage(1));
        dispatch(setProductsTotalCount(null));

        const formattedFilters = { ...buildFormattedFilters(), ...categoryFilterFor(screenTitle), ...filters };

        const queryParams = {
            ...formattedFilters,
            limit: 20,
            pageNumber: 1
        };

        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle: source ?? screenTitle }).unwrap();

            if (productResponse) {
                dispatch(setAllProducts(productResponse));
                await handleGetDynamicFilterOptions({...formattedFilters}, true);

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
        /* Clear the old results so the skeleton loader shows while the search
           runs, rather than the previous list. */
        dispatch(setAllProducts([]));
        dispatch(setCurrentPage(1));
        dispatch(setProductsTotalCount(null));

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
                await handleGetDynamicFilterOptions({search: searchPhrase}, true);
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
    const handlePrevAndNextPagination = async({screenTitle, direction, filters = {}, source}: {screenTitle: string, direction: string, filters?: Record<string, string>, source?: string}) => {
        // Already at the first page — nothing before it.
        if (direction === "Prev" && currentPage <= 1) return { pageChanged: false, reachedEnd: false };
        // The dynamic filter's totalCount tells us how many pages the list has.
        const totalPages = getTotalPages(productsTotalCount);
        if (direction === "Next" && totalPages !== null && currentPage >= totalPages) {
            return { pageChanged: false, reachedEnd: true };
        }

        const newPageNumber = direction === "Next" ? currentPage + 1 : currentPage - 1;

        dispatch(setLoadingMessage(`Fetching ${direction === "Next" ? "next" : "previous"} product page...`));
        dispatch(setIsLoading(true));

        // Carry the SAME filters + category across pages. Previously this sent
        // only { limit, pageNumber }, which dropped the gender/category filter so
        // page 2+ returned the entire catalogue.
        const queryParams = {
            ...buildFormattedFilters(),
            ...categoryFilterFor(screenTitle),
            ...filters,
            limit: PAGE_SIZE,
            pageNumber: newPageNumber,
        };

        try {
            const productResponse = await getFilteredProducts({queryParams, screenTitle: source ?? screenTitle}).unwrap();

            // End-of-list guard: an empty Next means there's no further page.
            // Keep the current list/page instead of blanking the screen with a
            // misleading "no product" empty state.
            if (direction === "Next" && (!productResponse || productResponse.length === 0)) {
                return { pageChanged: false, reachedEnd: true };
            }

            // Some feeds (e.g. Popular) repeat their last page instead of returning
            // an empty one, so the same products coming back also means the end.
            const currentIds = (allProducts ?? []).map((product) => product.productId).join("|");
            const nextIds = productResponse.map((product) => product.productId).join("|");
            if (direction === "Next" && currentIds === nextIds) {
                return { pageChanged: false, reachedEnd: true };
            }

            dispatch(setCurrentPage(newPageNumber));
            if (productResponse) {
                dispatch(setAllProducts(productResponse));
            }
            return { pageChanged: true, reachedEnd: false };
        } catch (error) {
            handleError(error);
            return { pageChanged: false, reachedEnd: false };
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters({});
        navigation.setParams({screenTitle: 'All Products', filters: undefined, source: undefined});
    };

    return {
        selectedFilters, selectedFiltersCount, toggleCheckboxOption, preselectCategoryFilters, handleGetDynamicFilterOptions,
        handleSubmit, handleGetFilteredProducts, handleGetPromoProducts, handleGetPopularProducts, handleGetNewestProducts,
        handleGetRecentlyViewedProducts, handleGetRecommendedProducts, handlePrevAndNextPagination, clearAllFilters,
    };
};

export default useFilterAndSearchHook;
