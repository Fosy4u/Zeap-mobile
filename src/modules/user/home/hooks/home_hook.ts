import { useDispatch } from "react-redux";
import { setAccessories, setBags, setCategories, setFemaleClothing, setMaleClothing, setNewestProducts, setPopularProducts, setShoes } from "../../products/slices/product_slice";

import { useLazyGetNewestProductsQuery, useLazyGetPopularProductsQuery, useLazyGetProductsByCategoriesQuery } from "../../products/apis/product_api";
import { INewestProduct } from "../../products/models/productState_model";




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
    const [getNewestProducts] = useLazyGetNewestProductsQuery();
    const [getProductsByCategories] = useLazyGetProductsByCategoriesQuery();
    const [getPopularProducts, { isLoading: popularProductIsLoading }] = useLazyGetPopularProductsQuery();
    const dispatch = useDispatch();



    const handleGetNewestProducts = async () => {
        try {
            const newestProducts = await getNewestProducts({
                limit: 10,
                pageNumber: 1
            }).unwrap();
    
            const formattedNewestProducts: INewestProduct[] = newestProducts.map((eachProduct, index) => ({
                id: eachProduct._id,
                discount: 20,
                message: `On ${newestProducts[index].title}`,
                imageLink: newestProducts[index].colors[0]?.images[1]?.link,
            }));
    
            // Dispatch to Redux Store
            dispatch(setNewestProducts(formattedNewestProducts));
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

    
    return {
        handleGetNewestProducts,
        handleGetFemaleClothing,
        handleGetMaleClothing,
        handleGetShoes,
        handleGetAccessories,
        handleGetBags,
        handleGetPopularProducts,
        popularProductIsLoading,
    };
};

export default useHomeHook;