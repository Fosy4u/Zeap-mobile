import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { ArrowDown2, ProfileCircle } from 'iconsax-react-native';
import { AppDispatch, RootState } from '../../../../redux/store/store.ts';
import { setShowSizedGuideBottomSheet, setSizeGuide } from '../slices/product_slice.ts';
import { useLazyGetSizeGuideQuery } from '../apis/product_api.ts';

type SizeGuideTab = "Top" | "Bottom" | "Footwear";
type Gender = "female" | "male";
type Unit = "cm" | "inch";

const COUNTRY_CODES = ["UK", "EU", "AUS", "US/CAN"];
const MEASUREMENT_COLUMNS = ["Bust", "Waist", "Hips", "Chest", "Foot Length"];

// Map a product to the size-guide tab it belongs under. Shoes are Footwear by
// product type. Clothing defaults to "Top" (blouse, shirt, t-shirt, dress…)
// and only flips to "Bottom" when the category/title clearly names a lower
// garment — matching how the size guide is split (top / bottom / footwear).
const resolveSizeGuideTab = (product: any): SizeGuideTab => {
    const productType = product?.productType;
    if (productType === "readyMadeShoe" || productType === "bespokeShoe") return "Footwear";

    const haystack = `${(product?.categories?.main ?? []).join(" ")} ${product?.title ?? ""}`.toLowerCase();
    if (/(footwear|shoe|sneaker|boot|sandal|heel|loafer|slipper)/.test(haystack)) return "Footwear";
    if (/(bottom|trouser|pant|jean|skirt|short|legging|jogger|chino|cargo|skort)/.test(haystack)) return "Bottom";
    return "Top";
};

interface ISizeGuideBottomSheetProps {
    productOverride?: any;
    onClose?: () => void;
    initialStandard?: string;
}

const SizeGuideBottomSheet: React.FC<ISizeGuideBottomSheetProps> = ({ productOverride, onClose, initialStandard }) => {
    const { sizeGuide, product: viewedProduct } = useSelector((state: RootState) => state.productState);
    const product = productOverride ?? viewedProduct;
    const [getSizeGuide] = useLazyGetSizeGuideQuery();
    const dispatch = useDispatch<AppDispatch>();
    const modalHeight = Dimensions.get("window").height * 0.85;
    const insets = useSafeAreaInsets();
    const slideAnimation = useRef<Animatable.View>(null);

    // Preselect the gender tab to match the product being viewed. Falls back to
    // Female when the product has no gender tag (or has multiple/unisex).
    const productGender = product?.categories?.gender?.[0]?.toLowerCase();
    const [gender, setGender] = useState<Gender>(productGender === "male" ? "male" : "female");
    const [selectedCategory, setSelectedCategory] = useState<SizeGuideTab>(() => resolveSizeGuideTab(product));
    const [unit, setUnit] = useState<Unit>("cm");
    const [countryCode, setCountryCode] = useState(() => {
        const standard = (initialStandard === "US" || initialStandard === "CAN") ? "US/CAN" : initialStandard;
        return standard && COUNTRY_CODES.includes(standard) ? standard : "UK";
    });
    const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);

    // Re-resolve if the sheet is reused for a different product after mount.
    useEffect(() => {
        setSelectedCategory(resolveSizeGuideTab(product));
    }, [product?._id, product?.productType]);

    useEffect(() => {
        if (slideAnimation.current) {
            slideAnimation.current.animate({
                0: { translateY: modalHeight },
                1: { translateY: 0 }
            }, 400);
        }
    }, [modalHeight]);

    const handleCloseSizeGuideBottomSheet = () => {
        // Dismiss immediately so the dark overlay disappears in sync with the
        // bottom sheet. Waiting on the slide-out animation kept the overlay
        // hanging around behind a no-longer-visible sheet.
        if (onClose) { onClose(); return; }
        dispatch(setShowSizedGuideBottomSheet(false));
    };

    useEffect(() => {
        if (!sizeGuide || Object.keys(sizeGuide).length === 0) {
            getSizeGuide().unwrap().then((response) => response && dispatch(setSizeGuide(response))).catch(() => null);
        }
    }, []);

    const isFemale = gender === "female";
    const headerColor = isFemale ? "bg-pink-500" : "bg-blue-500";
    const firstColumnColor = isFemale ? "bg-pink-100" : "bg-blue-100";
    const dropdownColor = isFemale ? "bg-pink-700" : "bg-cyan-700";
    const dropdownRing = isFemale ? "border-pink-300" : "border-cyan-300";

    const isLoadingGuide = !sizeGuide || Object.keys(sizeGuide).length === 0;
    const rows: Record<string, string>[] = sizeGuide?.[gender]?.[selectedCategory.toLowerCase()]?.[unit] ?? [];
    const tableData = rows.map((row) => {
        const visible: Record<string, string> = {};
        Object.keys(row).forEach((key) => {
            if (key === "Size" || key === countryCode || MEASUREMENT_COLUMNS.includes(key)) visible[key] = row[key];
        });
        return visible;
    });
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    return (
        <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={ () => handleCloseSizeGuideBottomSheet() }>
        <View className="flex-1 bg-black/40">
           <TouchableOpacity
                activeOpacity={ 1 }
                onPress={ () => handleCloseSizeGuideBottomSheet() }
                className="absolute top-0 bottom-0 left-0 right-0"
                accessibilityLabel="Close size guide"
           />
           <Animatable.View
                ref={slideAnimation}
                className="w-full absolute bottom-0 rounded-t-3xl overflow-hidden bg-white"
                style={{
                    height: modalHeight,
                    transform: [{ translateY: modalHeight }]
                }}
            >
                <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
                    <View className="h-[5px] w-[44px] mt-3 self-center rounded-full bg-gray-300" />

                    {/*==== Header ====*/}
                    <View className="h-auto w-full px-4 pt-3 pb-3 flex-row items-center justify-between">
                        <Text className="font-bold text-xl text-gray-900">Ready to wear size guide</Text>
                        <TouchableOpacity
                            onPress={ () => handleCloseSizeGuideBottomSheet() }
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Image
                                className="h-[22px] w-[22px]"
                                style={{ tintColor: "#6B7280" }}
                                source={ require("../../../../../assets/images/close.png") }
                            />
                        </TouchableOpacity>
                    </View>

                    { isLoadingGuide ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="small" color="#133522" />
                        </View>
                    ) : (
                    <ScrollView showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps="handled">
                        {/*==== Gender Tabs ====*/}
                        <View className="w-full flex-row bg-white border-b border-gray-200" style={{ shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
                            {(["female", "male"] as Gender[]).map((tabGender) => {
                                const isSelected = gender === tabGender;
                                const selectedClasses = tabGender === "female" ? "bg-pink-50 border-b-2 border-green-500" : "bg-blue-50 border-b-2 border-green-500";
                                const selectedTextColor = tabGender === "female" ? "text-pink-500" : "text-blue-500";
                                return (
                                    <TouchableOpacity
                                        key={ tabGender }
                                        onPress={ () => setGender(tabGender) }
                                        className={`flex-1 py-4 flex-row items-center justify-center ${ isSelected ? selectedClasses : "" }`}
                                    >
                                        <ProfileCircle size={ 18 } color="#9CA3AF" variant="Bold" />
                                        <Text className={`ml-2 font-medium text-base ${ isSelected ? selectedTextColor : "text-gray-900" }`}>
                                            { tabGender === "female" ? "Female" : "Male" }
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View className="px-3 pt-6 pb-8">
                            {/*==== Category Segmented Control ====*/}
                            <View className="w-full flex-row border border-gray-300 rounded-full overflow-hidden">
                                {(["Top", "Bottom", "Footwear"] as SizeGuideTab[]).map((category) => {
                                    const isSelected = selectedCategory === category;
                                    return (
                                        <TouchableOpacity
                                            key={ category }
                                            onPress={ () => setSelectedCategory(category) }
                                            className={`flex-1 py-2.5 items-center justify-center ${ isSelected ? "bg-baseGreen" : "bg-white" }`}
                                        >
                                            <Text className={`text-base ${ isSelected ? "font-semibold text-white" : "text-gray-500" }`}>{ category }</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/*==== Unit Toggle & Country Dropdown ====*/}
                            <View className="mt-5 flex-row items-center" style={{ zIndex: 20 }}>
                                <View className="p-1 flex-row items-center rounded-full border border-gray-300 bg-white" style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 }}>
                                    {(["cm", "inch"] as Unit[]).map((unitOption) => {
                                        const isSelected = unit === unitOption;
                                        return (
                                            <TouchableOpacity
                                                key={ unitOption }
                                                onPress={ () => setUnit(unitOption) }
                                                className={`px-5 py-2 rounded-full ${ isSelected ? "bg-baseGreen" : "" }`}
                                            >
                                                <Text className={`font-semibold text-sm ${ isSelected ? "text-white" : "text-gray-600" }`}>{ unitOption.toUpperCase() }</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <View className="ml-3">
                                    <TouchableOpacity
                                        onPress={ () => setIsCountryMenuOpen((open) => !open) }
                                        className={`px-4 py-2 flex-row items-center rounded-lg border-2 ${ dropdownColor } ${ isCountryMenuOpen ? dropdownRing : "border-transparent" }`}
                                    >
                                        <Text className="font-medium text-sm text-white">{ countryCode }</Text>
                                        <ArrowDown2 size={ 16 } color="#FFFFFF" style={{ marginLeft: 10 }} />
                                    </TouchableOpacity>

                                    { isCountryMenuOpen && (
                                        <View
                                            className="w-[130px] py-1 absolute top-[42px] left-0 rounded-lg border border-gray-100 bg-white"
                                            style={{ shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}
                                        >
                                            { COUNTRY_CODES.map((code) => (
                                                <TouchableOpacity
                                                    key={ code }
                                                    onPress={ () => {
                                                        setCountryCode(code);
                                                        setIsCountryMenuOpen(false);
                                                    } }
                                                    className={`px-4 py-2.5 ${ code === countryCode ? "bg-gray-100" : "" }`}
                                                >
                                                    <Text className="text-sm text-gray-700">{ code }</Text>
                                                </TouchableOpacity>
                                            )) }
                                        </View>
                                    ) }
                                </View>
                            </View>

                            {/*==== Table ====*/}
                            { tableData.length === 0 ? (
                                <View className="h-32 items-center justify-center">
                                    <Text className="font-semibold text-sm text-gray-500">No data available</Text>
                                </View>
                            ) : (
                                <View className="mt-10 rounded-lg border border-gray-200 overflow-hidden">
                                    <View className={`flex-row ${ headerColor }`}>
                                        { columns.map((column) => (
                                            <Text key={ column } className="flex-1 px-2 py-2 font-semibold text-[11px] text-white uppercase tracking-wider">
                                                { column }
                                            </Text>
                                        )) }
                                    </View>

                                    { tableData.map((row, rowIndex) => (
                                        <View key={ rowIndex } className={`flex-row border-b border-gray-200 ${ rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50" }`}>
                                            { columns.map((column, cellIndex) => (
                                                <Text
                                                    key={ column }
                                                    className={`flex-1 px-2 py-2 text-xs text-gray-900 ${ cellIndex === 0 ? `font-bold ${ firstColumnColor }` : "" }`}
                                                >
                                                    { row[column] || "-" }
                                                </Text>
                                            )) }
                                        </View>
                                    )) }
                                </View>
                            ) }
                        </View>
                    </ScrollView>
                    ) }
                </View>
            </Animatable.View>
        </View>
        </Modal>
    )
};

export default SizeGuideBottomSheet;
