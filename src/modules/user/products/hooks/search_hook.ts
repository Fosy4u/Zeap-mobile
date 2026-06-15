import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EncryptedStorage from "react-native-encrypted-storage";
import { AppDispatch, RootState } from "../../../../redux/store/store";
import { useLazySearchProductsQuery } from "../apis/product_api";
import { setSearchPhrase } from "../slices/product_slice";

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
            try {
                const stored = await EncryptedStorage.getItem(RECENT_SEARCHES_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        setRecentSearches(parsed.filter((s) => typeof s === "string").slice(0, MAX_RECENT_SEARCHES));
                    }
                }
            } catch {
                // Non-fatal — start with an empty list if storage is unreadable.
            }
        })();
    }, []);

    const persistRecentSearches = async (list: string[]) => {
        setRecentSearches(list);
        try {
            await EncryptedStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list));
        } catch {
            // Ignore persistence failures — the in-memory list still works for the session.
        }
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
            triggerSearch({ search: term, limit: DEFAULT_LIMIT, pageNumber: DEFAULT_PAGE });
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPhrase]);

    // Search icon: run immediately AND persist the term as a recent search.
    const handleSearchNow = () => {
        const term = searchPhrase?.trim();
        if (!term) { return; }
        triggerSearch({ search: term, limit: DEFAULT_LIMIT, pageNumber: DEFAULT_PAGE });
        saveRecentSearch(term);
    };

    // Tapping a recent search: fill the box and search immediately (no re-save —
    // it's already in the list).
    const selectRecentSearch = (term: string) => {
        dispatch(setSearchPhrase(term));
        triggerSearch({ search: term, limit: DEFAULT_LIMIT, pageNumber: DEFAULT_PAGE });
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
    };
};

export default useSearchHook;
