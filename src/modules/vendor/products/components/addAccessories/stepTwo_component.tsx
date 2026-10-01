import React from 'react';
import { Text, View } from 'react-native';
import IStepTwoAccessoryProductProps from '../../models/stepTwoAccessoryProductProps_model';
import SearchableDropdownComponent from '../searchableDropdown_component';

const StepTwoComponent: React.FC<IStepTwoAccessoryProductProps> = ({ manageState }) => {

    const {
        styleOptions, genderOptions, ageGroupOptions, ageRangeOptions, typeOptions,
        brandOptions, designOptions, occasionOptions, fasteningOptions,

        selectedStyle, setSelectedStyle,
        selectedGender, setSelectedGender,
        selectedAgeGroup, setSelectedAgeGroup,
        selectedAgeRange, setSelectedAgeRange,
        selectedType, setSelectedType,
        selectedBrand, setSelectedBrand,
        selectedDesign, setSelectedDesign,
        selectedOccasion, setSelectedOccasion,
        selectedFastening, setSelectedFastening,

        showStyleDropDown, setShowStyleDropDown,
        showGenderDropDown, setShowGenderDropDown,
        showAgeDropDown, setShowAgeDropDown,
        showAgeRangeDropDown, setShowAgeRangeDropDown,
        showTypeDropDown, setShowTypeDropDown,
        showBrandDropDown, setShowBrandDropDown,
        showDesignDropDown, setShowDesignDropDown,
        showOccasionDropDown, setShowOccasionDropDown,
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

                    {/* ==== Type ==== */}
                    <SearchableDropdownComponent
                        label="Type"
                        required
                        placeholder="Select a type"
                        options={ typeOptions }
                        isOpen={ showTypeDropDown }
                        onToggleOpen={ () => setShowTypeDropDown(!showTypeDropDown) }
                        mode="single"
                        selectedValue={ selectedType }
                        onSelectValue={ setSelectedType }
                    />

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
