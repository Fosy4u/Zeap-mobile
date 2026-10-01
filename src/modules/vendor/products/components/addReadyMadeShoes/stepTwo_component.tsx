import React from 'react';
import { Text, View } from "react-native";
import IStepTwoShoeProductProps from '../../models/stepTwoShoeProductProps_model';
import SearchableDropdownComponent from '../searchableDropdown_component';


const StepTwoComponent: React.FC<IStepTwoShoeProductProps> = ({ manageState }) => {

    const {
        styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, brandOptions,
        designOptions, occasionOptions, heelHeightOptions, heelTypeOptions, fasteningOptions,

        selectedStyle, setSelectedStyle,
        selectedGender, setSelectedGender,
        selectedAgeGroup, setSelectedAgeGroup,
        selectedAgeRange, setSelectedAgeRange,
        selectedBrand, setSelectedBrand,
        selectedDesign, setSelectedDesign,
        selectedOccasion, setSelectedOccasion,
        selectedHeelHeight, setSelectedHeelHeight,
        selectedHeelType, setSelectedHeelType,
        selectedFastening, setSelectedFastening,

        showStyleDropDown, setShowStyleDropDown,
        showGenderDropDown, setShowGenderDropDown,
        showAgeDropDown, setShowAgeDropDown,
        showAgeRangeDropDown, setShowAgeRangeDropDown,
        showBrandDropDown, setShowBrandDropDown,
        showDesignDropDown, setShowDesignDropDown,
        showOccasionDropDown, setShowOccasionDropDown,
        showHeelHeightDropDown, setShowHeelHeightDropDown,
        showHeelTypeDropDown, setShowHeelTypeDropDown,
        showFasteningDropDown, setShowFasteningDropDown,
    } = manageState;


    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 2: Category</Text>
            <Text className="mt-2 font-montserratMedium">Enter all correct information for this product’s category and proceed.</Text>

            {/* ==== Gender (selected first to reveal the rest of the form) ==== */}
            <SearchableDropdownComponent
                label="Gender"
                required
                placeholder="Select at least one gender"
                options={ genderOptions }
                isOpen={ showGenderDropDown }
                onToggleOpen={ () => setShowGenderDropDown(!showGenderDropDown) }
                mode="multi"
                selectedValues={ selectedGender }
                onChangeValues={ setSelectedGender }
            />

            {/* The remaining category fields are revealed only after a gender is
                selected, to drive a gender-first input flow. */}
            { selectedGender.length > 0 && (
                <>
                    {/* ==== Style ==== */}
                    <SearchableDropdownComponent
                        label="Style"
                        required
                        placeholder="Select at least one style"
                        options={ styleOptions }
                        isOpen={ showStyleDropDown }
                        onToggleOpen={ () => setShowStyleDropDown(!showStyleDropDown) }
                        mode="multi"
                        selectedValues={ selectedStyle }
                        onChangeValues={ setSelectedStyle }
                    />

                    {/* ==== Age Group ==== */}
                    <SearchableDropdownComponent
                        label="Age group"
                        required
                        placeholder="Select age group"
                        options={ ageGroupOptions }
                        isOpen={ showAgeDropDown }
                        onToggleOpen={ () => setShowAgeDropDown(!showAgeDropDown) }
                        mode="single"
                        selectedValue={ selectedAgeGroup }
                        onSelectValue={ setSelectedAgeGroup }
                    />

                    {/* Age range only applies when the age group is Kids. */}
                    { selectedAgeGroup === "Kids" && (
                        <SearchableDropdownComponent
                            label="Age range"
                            required
                            placeholder="Select age range"
                            options={ ageRangeOptions }
                            isOpen={ showAgeRangeDropDown }
                            onToggleOpen={ () => setShowAgeRangeDropDown(!showAgeRangeDropDown) }
                            mode="single"
                            selectedValue={ selectedAgeRange }
                            onSelectValue={ setSelectedAgeRange }
                        />
                    ) }

                    {/* ==== Brand ==== */}
                    <SearchableDropdownComponent
                        label="Brand"
                        required
                        placeholder="Select a brand"
                        options={ brandOptions }
                        isOpen={ showBrandDropDown }
                        onToggleOpen={ () => setShowBrandDropDown(!showBrandDropDown) }
                        mode="single"
                        selectedValue={ selectedBrand }
                        onSelectValue={ setSelectedBrand }
                    />

                    {/* ==== Design ==== */}
                    <SearchableDropdownComponent
                        label="Design"
                        required
                        placeholder="Select a design"
                        options={ designOptions }
                        isOpen={ showDesignDropDown }
                        onToggleOpen={ () => setShowDesignDropDown(!showDesignDropDown) }
                        mode="multi"
                        selectedValues={ selectedDesign }
                        onChangeValues={ setSelectedDesign }
                    />

                    {/* ==== Occasion ==== */}
                    <SearchableDropdownComponent
                        label="Occasion"
                        required
                        placeholder="Select an occasion"
                        options={ occasionOptions }
                        isOpen={ showOccasionDropDown }
                        onToggleOpen={ () => setShowOccasionDropDown(!showOccasionDropDown) }
                        mode="multi"
                        selectedValues={ selectedOccasion }
                        onChangeValues={ setSelectedOccasion }
                    />

                    {/* ==== Heel Height ==== */}
                    <SearchableDropdownComponent
                        label="Heel height"
                        required
                        placeholder="Select a heel height"
                        options={ heelHeightOptions }
                        isOpen={ showHeelHeightDropDown }
                        onToggleOpen={ () => setShowHeelHeightDropDown(!showHeelHeightDropDown) }
                        mode="single"
                        selectedValue={ selectedHeelHeight }
                        onSelectValue={ setSelectedHeelHeight }
                    />

                    {/* ==== Heel Type ==== */}
                    <SearchableDropdownComponent
                        label="Heel type"
                        required
                        placeholder="Select a heel type"
                        options={ heelTypeOptions }
                        isOpen={ showHeelTypeDropDown }
                        onToggleOpen={ () => setShowHeelTypeDropDown(!showHeelTypeDropDown) }
                        mode="single"
                        selectedValue={ selectedHeelType }
                        onSelectValue={ setSelectedHeelType }
                    />

                    {/* ==== Fastening ==== */}
                    <SearchableDropdownComponent
                        label="Fastening"
                        required
                        placeholder="Select a fastening"
                        options={ fasteningOptions }
                        isOpen={ showFasteningDropDown }
                        onToggleOpen={ () => setShowFasteningDropDown(!showFasteningDropDown) }
                        mode="multi"
                        selectedValues={ selectedFastening }
                        onChangeValues={ setSelectedFastening }
                    />
                </>
            ) }
        </View>
    );
};

export default StepTwoComponent;
