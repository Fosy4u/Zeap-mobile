import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readSecureJSON, writeSecureItem } from "../../../../utils/secureStorage";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import { useLazyGetDynamicFilterOptionsQuery, useLazySearchProductsQuery } from "../apis/product_api";
import { setSearchPhrase } from "../slices/product_slice";
import buildFilterParams from "../utils/buildFilterParams";
import { PAGE_SIZE, getTotalPages } from "./filterAndSearch_hook";

const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_PAGE = 1;

const RECENT_SEARCHES_KEY = "RECENT_SEARCHES";
const MAX_RECENT_SEARCHES = 5;

const useSearchHook = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { searchPhrase } = useSelector((state: RootState) => state.productState);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isRecentLoaded, setIsRecentLoaded] = useState(false);
    const lastSearchKeyRef = useRef("");
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [paginatingDirection, setPaginatingDirection] = useState<"Prev" | "Next" | null>(null);

    const [
        triggerSearch,
        { data: results = [], isFetching, isError, isUninitialized },
    ] = useLazySearchProductsQuery();

    useEffect(() => {
        (async () => {
            const parsed = await readSecureJSON<unknown>(RECENT_SEARCHES_KEY);
            if (Array.isArray(parsed)) {
                setRecentSearches(
                    parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_RECENT_SEARCHES),
                );
            }
            setIsRecentLoaded(true);
        })();
    }, []);

    const persistRecentSearches = async (list: string[]) => {
        setRecentSearches(list);
        await writeSecureItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
    };

    const saveRecentSearch = (rawTerm: string) => {
        const term = rawTerm.trim();
        if (!term) { return; }
        const deduped = recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase());
        persistRecentSearches([term, ...deduped].slice(0, MAX_RECENT_SEARCHES));
    };

    const removeRecentSearch = (term: string) => {
        persistRecentSearches(recentSearches.filter((s) => s !== term));
    };

    const [selectedFilters, setSelectedFilters] = useState<Record<string, (string | number)[]>>({});
    const [showBottomSheetModal, setShowBottomSheetModal] = useState(false);
    const [getDynamicFilterOptions, { data: dynamicFilterData, isFetching: filtersLoading }] =
        useLazyGetDynamicFilterOptionsQuery();
    const dynamicFilterOptions = useMemo(() => dynamicFilterData?.dynamicFilters ?? [], [dynamicFilterData]);

    const formattedFilters = useMemo(
        () => buildFilterParams(selectedFilters, dynamicFilterOptions),
        [selectedFilters, dynamicFilterOptions],
    );

    const [getResultsCount, { data: resultsCountData }] = useLazyGetDynamicFilterOptionsQuery();
    const totalCount = resultsCountData?.totalCount ?? null;
    const totalPages = getTotalPages(totalCount);

    const runSearch = (term: string, page: number = DEFAULT_PAGE) => {
        lastSearchKeyRef.current = `${ term }|${ JSON.stringify(formattedFilters) }`;
        if (page === DEFAULT_PAGE) {
            setCurrentPage(DEFAULT_PAGE);
            getResultsCount({ queryParams: { search: term, ...formattedFilters } });
        }
        return triggerSearch({ search: term, limit: PAGE_SIZE, pageNumber: page, filters: formattedFilters });
    };

    const isPrevDisabled = !!paginatingDirection || isFetching || currentPage <= 1;
    const isNextDisabled = !!paginatingDirection || isFetching || (totalPages !== null
        ? currentPage >= totalPages
        : results.length < PAGE_SIZE);

    const handlePaginate = async (direction: "Prev" | "Next") => {
        const term = searchPhrase?.trim();
        if (!term || (direction === "Prev" ? isPrevDisabled : isNextDisabled)) { return false; }

        const nextPage = direction === "Next" ? currentPage + 1 : currentPage - 1;
        setPaginatingDirection(direction);
        try {
            await runSearch(term, nextPage).unwrap();
            setCurrentPage(nextPage);
            return true;
        } catch {
            return false;
        } finally {
            setPaginatingDirection(null);
        }
    };

    const activeFilterCount = useMemo(
        () => Object.values(selectedFilters).reduce((n, v) => n + (v?.length ?? 0), 0),
        [selectedFilters],
    );

    const toggleCheckboxOption = useCallback((filterName: string, optionValue: string | number) => {
        setSelectedFilters((prev) => {
            const current = prev[filterName] ?? [];
            const next = current.includes(optionValue)
                ? current.filter((v) => v !== optionValue)
                : [...current, optionValue];

            if (!next.length) {
                const { [filterName]: _dropped, ...rest } = prev;
                return rest;
            }
            return { ...prev, [filterName]: next };
        });
    }, []);

    const clearAllFilters = useCallback(() => setSelectedFilters({}), []);

    useEffect(() => {
        const term = searchPhrase?.trim();
        if (!term || lastSearchKeyRef.current === `${ term }|${ JSON.stringify(formattedFilters) }`) { return; }
        const handle = setTimeout(() => {
            runSearch(term);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPhrase, formattedFilters]);

    const handleSearchNow = () => {
        const term = searchPhrase?.trim();
        if (!term) { return; }
        runSearch(term);
        saveRecentSearch(term);
    };

    const searchFor = (rawTerm: string) => {
        const term = rawTerm.trim();
        if (!term) { return; }
        dispatch(setSearchPhrase(term));
        runSearch(term);
        saveRecentSearch(term);
    };

    const handleOpenFilters = () => {
        const term = searchPhrase?.trim();
        getDynamicFilterOptions({ queryParams: { ...(term ? { search: term } : {}), ...formattedFilters } });
        setShowBottomSheetModal(true);
    };

    const selectRecentSearch = (term: string) => {
        dispatch(setSearchPhrase(term));
        runSearch(term);
    };

    return {
        results,
        isFetching,
        isError,
        isUninitialized,
        handleSearchNow,
        searchFor,
        isRecentLoaded,
        recentSearches,
        removeRecentSearch,
        selectRecentSearch,

        // Pagination
        currentPage,
        totalPages,
        paginatingDirection,
        isPrevDisabled,
        isNextDisabled,
        handlePaginate,

        // Filters
        selectedFilters,
        toggleCheckboxOption,
        clearAllFilters,
        dynamicFilterOptions,
        filtersLoading,
        activeFilterCount,
        showBottomSheetModal,
        setShowBottomSheetModal,
        handleOpenFilters,
    };
};

export default useSearchHook;
