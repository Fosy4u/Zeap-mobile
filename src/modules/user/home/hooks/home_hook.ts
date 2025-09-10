import { Linking } from "react-native";


const useHomeHook = (): any => {
    
    // const handleGetFemaleClothing = async () => {
    //     const requestData = {
    //         productType: "Ready Made Cloth",
    //         gender: "Female",
    //         limit: 20,
    //         pageNumber: 1
    //     };

    //     try {
    //         const femaleCategories = await getProductsByCategories(requestData).unwrap();
    //         // console.log("FEMALE CLOTHINGS COUNT::: ", femaleCategories.totalCount);
    
    //         // Dispatch to Redux Store
    //         dispatch(setFemaleClothing(femaleCategories.products));
    //         dispatch(setCategories({ name: "Female Clothings", totalCount: femaleCategories.totalCount }));
    //     } catch (error) {
    //         console.log("ERROR::: ", error);
    //     }
    // };
    
    // const handleGetMaleClothing = async () => {
    //     try {
    //         const maleCategories = await getProductsByCategories({
    //             productType: "Ready Made Cloth", 
    //             gender: "Male",
    //             limit: 20,
    //             pageNumber: 1
    //         }).unwrap();

    //         // Dispatch to Redux Store
    //         dispatch(setMaleClothing(maleCategories.products));
    //         dispatch(setCategories({ name: "Male Clothings", totalCount: maleCategories.totalCount }));
    //         // console.log("MALE CLOTHINGS COUNT::: ", maleCategories.totalCount);
    //     } catch (error) {
    //         console.log("ERROR::: ", error);
    //     }
    // };
    
    // const handleGetShoes = async () => {
    //     try {
    //         const shoeCategories = await getProductsByCategories({
    //             productType: "Ready Made Shoe",
    //             limit: 20,
    //             pageNumber: 1
    //         }).unwrap();

    //         // Dispatch to Redux Store
    //         dispatch(setShoes(shoeCategories.products));
    //         dispatch(setCategories({ name: "Shoes", totalCount: shoeCategories.totalCount }));
    //         // console.log("SHOES COUNT::: ", shoeCategories.totalCount);
    //     } catch (error) {
    //         console.log("ERROR::: ", error);
    //     }
    // };
    
    // const handleGetAccessories = async () => {
    //     try {
    //         const accessoryCategories = await getProductsByCategories({
    //             productType: "Accessory",
    //             accessoryType: "Jewelry",
    //             limit: 20,
    //             pageNumber: 1
    //         }).unwrap();

    //         // Dispatch to Redux Store
    //         dispatch(setAccessories(accessoryCategories.products));
    //         dispatch(setCategories({ name: "Accessories", totalCount: accessoryCategories.totalCount }));
    //         // console.log("ACCESSORY COUNT::: ", accessoryCategories.totalCount);
    //     } catch (error) {
    //         console.log("ERROR::: ", error);
    //     }
    // };
    
    // const handleGetBags = async () => {
    //     try {
    //         const bagCategories = await getProductsByCategories({
    //             productType: "Accessory",
    //             accessoryType: "Bag",
    //             limit: 20,
    //             pageNumber: 1
    //         }).unwrap();

    //         // Dispatch to Redux Store
    //         dispatch(setBags(bagCategories.products));
    //         dispatch(setCategories({ name: "Bags", totalCount: bagCategories.totalCount }));
    //         // console.log("BAG COUNT::: ", bagCategories.totalCount);
    //     } catch (error) {
    //         console.log("ERROR::: ", error);
    //     }
    // };

    // Handle Open WhatsApp
    const handleOpenWhatsApp = async () => {
        try {
          const url = 'https://wa.me/447375387114';
          await Linking.openURL(url);
        } catch (error) {
          console.error("Error opening WhatsApp:", error);
        };
    };

    // useEffect(() => {
    //     (async () => {
    //       try {
    //         // Get UID from the secure storage
    //         const uid = (await EncryptedStorage.getItem("authUID")) || (await EncryptedStorage.getItem("guestUID")) || "";
            
    //         // Get Auth user data
    //         const userData = await getUserById(uid).unwrap();
    //         console.log("USER DATA::: ", userData);
    
    //         if (userData) {
    //             // Dispatch to Redux Store
    //             dispatch(setUserData(userData));
    //         }
    //       } catch (error) {
    //         console.log("ERROR::: ", error);   
    //       }
    //     })()
    // }, []);

    
    return {
        handleOpenWhatsApp,
    };
};

export default useHomeHook;