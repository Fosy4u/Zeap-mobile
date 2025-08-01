import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import { ArrowDown2, ArrowUp2} from "iconsax-react-native";
import CheckBox from '@react-native-community/checkbox';
import IStepTwoProps from '../../models/stepTwoBespokeClotheProps_model';


const StepTwoComponent: React.FC<IStepTwoProps> = ({ manageState }) => {

    const {
        mainOptions, styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, brandOptions,
        designOptions, occasionOptions, sleeveLengthOptions, fasteningOptions, fitOptions,

        selectedMain, setSelectedMain,
        selectedStyle, setSelectedStyle,
        selectedGender, setSelectedGender,
        selectedAgeGroup, setSelectedAgeGroup,
        selectedAgeRange, setSelectedAgeRange,
        selectedBrand, setSelectedBrand,
        selectedDesign, setSelectedDesign,
        selectedOccasion, setSelectedOccasion,
        selectedSleeveLength, setSelectedSleeveLength,
        selectedFastening, setSelectedFastening,
        selectedFit, setSelectedFit,

        showMainDropDown, setShowMainDropDown,
        showStyleDropDown, setShowStyleDropDown,
        showGenderDropDown, setShowGenderDropDown,
        showAgeDropDown, setShowAgeDropDown,
        showAgeRangeDropDown, setShowAgeRangeDropDown,
        showBrandDropDown, setShowBrandDropDown,
        showDesignDropDown, setShowDesignDropDown,
        showOccasionDropDown, setShowOccasionDropDown,
        showSleeveLengthDropDown, setShowSleeveLengthDropDown,
        showFasteningDropDown, setShowFasteningDropDown,
        showFitDropDown, setShowFitDropDown,
    } = manageState;


    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 2: Category</Text>
            <Text className="mt-2 font-montserratMedium">Enter all correct information for this product’s category and proceed.</Text>

            {/* ==== Main category ==== */}
            <Text aria-label="Main" nativeID="main" className="mt-5 font-montserratMedium">Main category<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showMainDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowMainDropDown(!showMainDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one main category</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { mainOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedMain.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedMain([...selectedMain, item]);
                                                } else {
                                                    setSelectedMain(selectedMain.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowMainDropDown(!showMainDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            {/* { (selectedMain.length > 0) ? (
                                selectedMain.map((item: string, index: number) => (
                                    <View key={ index } className="px-3 py-1 bg-baseGreen rounded-lg">
                                        <Text className="font-montserratMedium text-base  text-white">{ item }</Text>
                                    </View>
                                ))
                            ) : (
                                <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one main category</Text>
                            )} */}
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one main category</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* { errors.main && <Text claSelectList doesn't pre-select the savedDraftProduct ssName="text-red-600 text-xs mt-1">{errors.main.message}</Text> } */}
            </View>

            {/* ==== Style ==== */}
            <Text aria-label="Style" nativeID="style" className="mt-5 font-montserratMedium">Style<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showStyleDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowStyleDropDown(!showStyleDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one style</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { styleOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedStyle.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedStyle([...selectedStyle, item]);
                                                } else {
                                                    setSelectedStyle(selectedStyle.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowStyleDropDown(!showStyleDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one style</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* { errors.main && <Text claSelectList doesn't pre-select the savedDraftProduct ssName="text-red-600 text-xs mt-1">{errors.main.message}</Text> } */}
            </View>

            {/* ==== Gender ==== */}
            <Text aria-label="Gender" nativeID="gender" className="mt-5 font-montserratMedium">Gender<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showGenderDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowGenderDropDown(!showGenderDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one gender</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { genderOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedGender.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedGender([...selectedGender, item]);
                                                } else {
                                                    setSelectedGender(selectedGender.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowGenderDropDown(!showGenderDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one gender</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* { errors.main && <Text claSelectList doesn't pre-select the savedDraftProduct ssName="text-red-600 text-xs mt-1">{errors.main.message}</Text> } */}
            </View>

            {/* ==== Age Group ==== */}
            <Text aria-label="AgeGroup" nativeID="ageGroup" className="mt-5 font-montserratMedium">Age group<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showAgeDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowAgeDropDown(!showAgeDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one age group</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { ageGroupOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <TouchableOpacity onPress={ () => {
                                            setSelectedAgeGroup(item);
                                            setShowAgeDropDown(false);
                                        } }
                                            className="h-auto w-full px-2 py-2"
                                        >
                                            <Text className="font-montserratMedium text-sm">{ item }</Text>
                                        </TouchableOpacity>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowAgeDropDown(!showAgeDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >{ selectedAgeGroup ? selectedAgeGroup : "Select age group" }</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) } 
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select age group.</Text> */}
            </View>

            {/* Check if the selected age is kids, then display the ageRange Dropdown */}
            { selectedAgeGroup === "Kids" && (
                <View>
                    <Text aria-label="AgeRange" nativeID="ageRange" className="mt-5 font-montserratMedium">Age range<Text className="text-red-600">*</Text></Text>
                    <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                        { showAgeRangeDropDown ? (
                            <>
                                <TouchableOpacity
                                    onPress={ () => setShowAgeRangeDropDown(!showAgeRangeDropDown) }
                                    className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                                >
                                    <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one age range</Text>
                                    <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                                </TouchableOpacity>

                                <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                                    <ScrollView
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                                    >
                                        { ageRangeOptions.map((item: string, index: number) => (
                                            <View key={ index } className="flex-row items-center gap-x-2">
                                                <TouchableOpacity onPress={ () => {
                                                    setSelectedAgeRange(item);
                                                    setShowAgeRangeDropDown(false);
                                                } }
                                                    className="h-auto w-full px-2 py-2"
                                                >
                                                    <Text className="font-montserratMedium text-sm">{ item }</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )) }
                                    </ScrollView>
                                </View>
                            </>
                        ) : (
                            <TouchableOpacity
                                onPress={ () => setShowAgeRangeDropDown(!showAgeRangeDropDown) }
                                className="py-1.5 flex-row items-center justify-between"
                            >
                                <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                                    <Text className="h-auto flex-1 text-base text-[#9ca3af]" >{ selectedAgeRange ? selectedAgeRange : "Select age range" }</Text>
                                </View>
                                <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                            </TouchableOpacity>
                        ) }
                        {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select age group.</Text> */}
                    </View>
                </View>
            )}

            {/* ==== Brand ==== */}
            <Text aria-label="Brand" nativeID="brand" className="mt-5 font-montserratMedium">Brand<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showBrandDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowBrandDropDown(!showBrandDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one brand</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { brandOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <TouchableOpacity onPress={ () => {
                                            setSelectedBrand(item);
                                            setShowBrandDropDown(false);
                                        } }
                                            className="h-auto w-full px-2 py-2"
                                        >
                                            <Text className="font-montserratMedium text-sm">{ item }</Text>
                                        </TouchableOpacity>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowBrandDropDown(!showBrandDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >{  selectedBrand ? selectedBrand : "Select a brand" }</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select brand.</Text> */}
            </View>

            {/* ==== Design ==== */}
            <Text aria-label="Design" nativeID="design" className="mt-5 font-montserratMedium">Design<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showDesignDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowDesignDropDown(!showDesignDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one design</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { designOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedDesign.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedDesign([...selectedDesign, item]);
                                                } else {
                                                    setSelectedDesign(selectedDesign.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowDesignDropDown(!showDesignDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select a design</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select design.</Text> */}
            </View>

            {/* ==== Occasion ==== */}
            <Text aria-label="Occasion" nativeID="occasion" className="mt-5 font-montserratMedium">Occasion<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showOccasionDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowOccasionDropDown(!showOccasionDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one occasion</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { occasionOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedOccasion.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedOccasion([...selectedOccasion, item]);
                                                } else {
                                                    setSelectedOccasion(selectedOccasion.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowOccasionDropDown(!showOccasionDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select an occasion</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select occasion.</Text> */}
            </View>

            {/* ==== Sleeve Length ==== */}
            <Text aria-label="SleeveLength" nativeID="occasion" className="mt-5 font-montserratMedium">Sleeve length<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showSleeveLengthDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowSleeveLengthDropDown(!showSleeveLengthDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one sleeve length</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { sleeveLengthOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                    <TouchableOpacity onPress={ () => {
                                        setSelectedSleeveLength(item);
                                        setShowSleeveLengthDropDown(false);
                                    } }
                                        className="h-auto w-full px-2 py-2"
                                    >
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </TouchableOpacity>
                                </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowSleeveLengthDropDown(!showSleeveLengthDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >{ selectedSleeveLength ? selectedSleeveLength : "Select a sleeve length" }</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select sleeve length.</Text> */}
            </View>

            {/* ==== Fastening ==== */}
            <Text aria-label="Fastening" nativeID="fastning" className="mt-5 font-montserratMedium">Fastening<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showFasteningDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowFasteningDropDown(!showFasteningDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one fastening</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { fasteningOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedFastening.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedFastening([...selectedFastening, item]);
                                                } else {
                                                    setSelectedFastening(selectedFastening.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowFasteningDropDown(!showFasteningDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select a fastening</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select fastening.</Text> */}
            </View>

            {/* ==== Fit ==== */}
            <Text aria-label="Fit" nativeID="fit" className="mt-5 font-montserratMedium">Fit<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { showFitDropDown ? (
                    <>
                        <TouchableOpacity
                            onPress={ () => setShowFitDropDown(!showFitDropDown) }
                            className="px-2 py-4 flex-row items-center justify-between  rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select at least one fit</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        <View className="max-h-[280px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { fitOptions.map((item: string, index: number) => (
                                    <View key={ index } className="flex-row items-center gap-x-2">
                                        <CheckBox
                                            value={ selectedFit.includes(item) }
                                            onValueChange={ (newValue: boolean) => {
                                                if (newValue) {
                                                    setSelectedFit([...selectedFit, item]);
                                                } else {
                                                    setSelectedFit(selectedFit.filter((value: string) => value !== item));
                                                }
                                            } }
                                            tintColors={{ true: "gray", false: "gray" }}
                                            lineWidth={1}
                                            style={{
                                                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                                            }}
                                        /> 
                                        <Text className="font-montserratMedium text-sm">{ item }</Text>
                                    </View>
                                )) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowFitDropDown(!showFitDropDown) }
                        className="py-1.5 flex-row items-center justify-between"
                    >
                        <View className="h-auto w-full flex-1 flex-row items-center justify-start flex-wrap space-x-2 space-y-1">
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]" >Select a fit</Text>
                        </View>
                        <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                    </TouchableOpacity>
                ) }
                {/* <Text className="mt-2 font-montserratNormal text-xs text-red-600">Select fit.</Text> */}
            </View>
        </View>
    )
}
export default StepTwoComponent;
