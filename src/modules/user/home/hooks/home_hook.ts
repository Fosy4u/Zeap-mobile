import { useDispatch } from "react-redux";
import { setAccessories, setAllProducts, setBags, setCategories, setFemaleClothing, setMaleClothing, setNewestArrivals, setPopularProducts, setPromoProducts, setShoes } from "../../products/slices/product_slice";

import { useLazyGetAllLiveProductsQuery, useLazyGetNewestArrivalsQuery, useLazyGetPopularProductsQuery, useLazyGetProductsByCategoriesQuery, useLazyGetPromoProductsQuery } from "../../products/apis/product_api";




/**
 * The useHomeHook
 * @returns {
 * handleGetNewestProducts,
 * handleGetFemaleClothing,
 * handleGetMaleClothing,
 * handleGetShoes,
 * handleGetAccessories,
 * handleGetBags,
 * handleGetPopularProducts,
 * popularProductIsLoading,
 * }
 */
const useHomeHook = () => {
    const [getPromoProducts] = useLazyGetPromoProductsQuery();
    const [getAllLiveProducts] = useLazyGetAllLiveProductsQuery();
    const [getNewestArrivals, { isLoading: newestArrivalsIsLoading }] = useLazyGetNewestArrivalsQuery();
    const [getProductsByCategories] = useLazyGetProductsByCategoriesQuery();
    const [getPopularProducts, { isLoading: popularProductIsLoading }] = useLazyGetPopularProductsQuery();
    const dispatch = useDispatch();

    const handleGetPromoProducts = async () => {
        try {
            const promoProducts = await getPromoProducts().unwrap();
            dispatch(setPromoProducts(promoProducts));
            // console.log("PROMO PRODUCTS::: ", promoProducts);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    const handleGetAllLiveProducts = async () => {
        try {
            const allLiveProducts = await getAllLiveProducts({
                limit: 20,
                pageNumber: 1
            }).unwrap();

            dispatch(setAllProducts(allLiveProducts));
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    const handleGetPopularProducts = async () => {
        try {
            const popularProducts = await getPopularProducts({
                limit: 20,
                pageNumber: 1
            }).unwrap();

            // Dispatch to Redux Store
            dispatch(setPopularProducts(popularProducts));
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    const handleGetNewestArrivals = async () => {
        try {
            const newestArrivals = await getNewestArrivals({
                limit: 20,
                pageNumber: 1
            }).unwrap();
    
            // Dispatch to Redux Store
            dispatch(setNewestArrivals(newestArrivals));
            // console.log("NEWEST PRODUCT::: ", formattedNewestProducts);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleGetFemaleClothing = async () => {
        try {
            const femaleCategories = await getProductsByCategories({
                productType: "Ready Made Cloth",
                gender: "Female",
                limit: 20,
                pageNumber: 1
            }).unwrap();
    
            // Dispatch to Redux Store
            dispatch(setFemaleClothing(femaleCategories.products));
            dispatch(setCategories({ name: "Female Clothings", totalCount: femaleCategories.totalCount }));
            // console.log("FEMALE CLOTHINGS COUNT::: ", femaleCategories.totalCount);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleGetMaleClothing = async () => {
        try {
            const maleCategories = await getProductsByCategories({
                productType: "Ready Made Cloth", 
                gender: "Male",
                limit: 20,
                pageNumber: 1
            }).unwrap();

            // Dispatch to Redux Store
            dispatch(setMaleClothing(maleCategories.products));
            dispatch(setCategories({ name: "Male Clothings", totalCount: maleCategories.totalCount }));
            // console.log("MALE CLOTHINGS COUNT::: ", maleCategories.totalCount);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleGetShoes = async () => {
        try {
            const shoeCategories = await getProductsByCategories({
                productType: "Ready Made Shoe",
                limit: 20,
                pageNumber: 1
            }).unwrap();

            // Dispatch to Redux Store
            dispatch(setShoes(shoeCategories.products));
            dispatch(setCategories({ name: "Shoes", totalCount: shoeCategories.totalCount }));
            // console.log("SHOES COUNT::: ", shoeCategories.totalCount);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleGetAccessories = async () => {
        try {
            const accessoryCategories = await getProductsByCategories({
                productType: "Accessory",
                accessoryType: "Jewelry",
                limit: 20,
                pageNumber: 1
            }).unwrap();

            // Dispatch to Redux Store
            dispatch(setAccessories(accessoryCategories.products));
            dispatch(setCategories({ name: "Accessories", totalCount: accessoryCategories.totalCount }));
            // console.log("ACCESSORY COUNT::: ", accessoryCategories.totalCount);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    const handleGetBags = async () => {
        try {
            const bagCategories = await getProductsByCategories({
                productType: "Accessory",
                accessoryType: "Bag",
                limit: 20,
                pageNumber: 1
            }).unwrap();

            // Dispatch to Redux Store
            dispatch(setBags(bagCategories.products));
            dispatch(setCategories({ name: "Bags", totalCount: bagCategories.totalCount }));
            // console.log("BAG COUNT::: ", bagCategories.totalCount);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    
    return {
        handleGetPromoProducts,
        handleGetAllLiveProducts,
        handleGetPopularProducts,
        handleGetNewestArrivals,
        handleGetFemaleClothing,
        handleGetMaleClothing,
        handleGetShoes,
        handleGetAccessories,
        handleGetBags,
        popularProductIsLoading,
        newestArrivalsIsLoading,
    };
};

export default useHomeHook;