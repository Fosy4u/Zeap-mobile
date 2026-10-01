import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readSecureJSON, writeSecureItem } from "../../../../utils/secureStorage";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import { useLazyGetDynamicFilterOptionsQuery, useLazySearchProductsQuery } from "../apis/product_api";
import { setSearchPhrase } from "../slices/product_slice";
import buildFilterParams from "../utils/buildFilterParams";

// 500ms debounce — fires the search once the user has paused typing. Standard
// UX sweet spot: responsive enough to feel live, slow enough that mid-word
// keystrokes don't spam the backend.
const SEARCH_DEBOUNCE_MS = 500;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

// Recent searches are persisted in secure storage, newest-first, deduped, and
// capped at MAX_RECENT_SEARCHES.
const RECENT_SEARCHES_KEY = "RECENT_SEARCHES";
const MAX_RECENT_SEARCHES = 5;

const useSearchHook = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { searchPhrase } = useSelector((state: RootState) => state.productState);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const [
        triggerSearch,
        { data: results = [], isFetching, isError, isUninitialized },
    ] = useLazySearchProductsQuery();

    // Load persisted recent searches once on mount.
    useEffect(() => {
        (async () => {
            const parsed = await readSecureJSON<unknown>(RECENT_SEARCHES_KEY);
            if (Array.isArray(parsed)) {
                setRecentSearches(
                    parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_RECENT_SEARCHES),
                );
            }
        })();
    }, []);

    const persistRecentSearches = async (list: string[]) => {
        setRecentSearches(list);
        await writeSecureItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
    };

    // Add a term to the top: dedupe case-insensitively, newest-first, capped at
    // MAX_RECENT_SEARCHES. Called ONLY when the user explicitly runs a search.
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
    const [getDynamicFilterOptions, { data: dynamicFilterOptions = [], isFetching: filtersLoading }] =
        useLazyGetDynamicFilterOptionsQuery();

    const formattedFilters = useMemo(
        () => buildFilterParams(selectedFilters, dynamicFilterOptions),
        [selectedFilters, dynamicFilterOptions],
    );

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

    // Debounced auto-search while typing. Does NOT persist the term — saving only
    // happens on an explicit search (the magnifying-glass button).
    //
    // Deps are intentionally ONLY [searchPhrase]. Including `triggerSearch` here
    // caused an infinite re-fetch loop: each result arrival re-rendered the
    // screen, the effect re-ran, and scheduled another search — so `isFetching`
    // never settled and the spinner span forever. `triggerSearch` is stable
    // enough to call from the captured closure.
    useEffect(() => {
        const term = searchPhrase?.trim();
        if (!term) { return; }
        const handle = setTimeout(() => {
            triggerSearch({ search: term, limit: DEFAULT_LIMIT, pageNumber: DEFAULT_PAGE, filters: formattedFilters });
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPhrase, formattedFilters]);

    // Search icon: run immediately AND persist the term as a recent search.
    const handleSearchNow = () => {
        const term = searchPhrase?.trim();
        if (!term) { return; }
        triggerSearch({ search: term, limit: DEFAULT_LIMIT, pageNumber: DEFAULT_PAGE, filters: formattedFilters });
        saveRecentSearch(term);
    };

    const handleOpenFilters = () => {
        const term = searchPhrase?.trim();
        getDynamicFilterOptions({ queryParams: { ...(term ? { search: term } : {}), ...formattedFilters } });
        setShowBottomSheetModal(true);
    };

    // Tapping a recent search: fill the box and search immediately (no re-save —
    // it's already in the list).
    const selectRecentSearch = (term: string) => {
        dispatch(setSearchPhrase(term));
        triggerSearch({ search: term, limit: DEFAULT_LIMIT, pageNumber: DEFAULT_PAGE, filters: formattedFilters });
    };

    return {
        results,
        isFetching,
        isError,
        isUninitialized,
        handleSearchNow,
        recentSearches,
        removeRecentSearch,
        selectRecentSearch,

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
