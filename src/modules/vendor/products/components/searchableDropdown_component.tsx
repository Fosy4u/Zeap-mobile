import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowDown2, ArrowUp2, SearchNormal1 } from 'iconsax-react-native';
import CheckBox from '@react-native-community/checkbox';

interface ISearchableDropdownProps {
    label: string;
    required?: boolean;
    placeholder: string;
    options: string[];
    isOpen: boolean;
    onToggleOpen: () => void;
    mode: "multi" | "single";

    // Multi-select wiring
    selectedValues?: string[];
    onChangeValues?: (next: string[]) => void;

    // Single-select wiring
    selectedValue?: string;
    onSelectValue?: (value: string) => void;

    searchThreshold?: number;
}

// Reusable category dropdown for the bespoke-clothes step 2 form. When an
// option list has more than `searchThreshold` items it renders a search input
// that filters the list as the user types. The transient search text is local
// UI state of this widget; the selection/open state is owned by the step hook.
const SearchableDropdownComponent: React.FC<ISearchableDropdownProps> = ({
    label,
    required = false,
    placeholder,
    options,
    isOpen,
    onToggleOpen,
    mode,
    selectedValues = [],
    onChangeValues,
    selectedValue = "",
    onSelectValue,
    searchThreshold = 6,
}) => {
    const [query, setQuery] = useState("");

    const isSearchable = options.length > searchThreshold;
    const normalizedQuery = query.trim().toLowerCase();
    const filteredOptions = isSearchable && normalizedQuery
        ? options.filter((option) => option.toLowerCase().includes(normalizedQuery))
        : options;

    const collapsedText = mode === "single" ? (selectedValue || placeholder) : placeholder;

    const handleToggleMulti = (item: string, checked: boolean) => {
        if (!onChangeValues) return;
        if (checked) {
            onChangeValues([...selectedValues, item]);
        } else {
            onChangeValues(selectedValues.filter((value) => value !== item));
        }
    };

    const handleSelectSingle = (item: string) => {
        onSelectValue?.(item);
        setQuery("");
        onToggleOpen(); // close after picking (the dropdown is open here)
    };

    return (
        <>
            <Text aria-label={ label } className="mt-5 font-montserratMedium">
                { label }{ required && <Text className="text-red-600">*</Text> }
            </Text>
            <View className="h-auto w-full mt-1.5 px-3 py-2.5 border rounded-xl border-gray-200 bg-gray-50 z-50">
                { isOpen ? (
                    <>
                        <TouchableOpacity
                            onPress={ onToggleOpen }
                            className="px-2 py-4 flex-row items-center justify-between rounded-lg border border-[#ececed]"
                        >
                            <Text className="h-auto flex-1 text-base text-[#9ca3af]">{ placeholder }</Text>
                            <ArrowUp2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </TouchableOpacity>

                        {/* Inline search — only for long lists. */}
                        { isSearchable && (
                            <View className="mt-2 px-3 py-1 flex-row items-center border border-[#ececed] rounded-lg bg-white">
                                <SearchNormal1 size={16} color="#9ca3af" />
                                <TextInput
                                    value={ query }
                                    onChangeText={ setQuery }
                                    placeholder="Search..."
                                    placeholderTextColor="#9ca3af"
                                    className="h-[44px] ml-2 flex-1 font-montserratMedium text-sm"
                                />
                            </View>
                        ) }

                        <View className="max-h-[380px] mt-2 border border-gray-200 rounded-lg overflow-hidden">
                            <ScrollView
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ flexGrow: 1, padding: 10 }}
                            >
                                { filteredOptions.length === 0 ? (
                                    <Text className="px-2 py-2 font-montserratMedium text-sm text-gray-400">No matches found</Text>
                                ) : mode === "multi" ? (
                                    filteredOptions.map((item: string, index: number) => {
                                        const isChecked = selectedValues.includes(item);

                                        return (
                                            <TouchableOpacity
                                                key={ index }
                                                onPress={ () => handleToggleMulti(item, !isChecked) }
                                                activeOpacity={ 0.6 }
                                                accessibilityRole="checkbox"
                                                accessibilityState={{ checked: isChecked }}
                                                accessibilityLabel={ item }
                                                className="h-auto w-full my-0.5 px-1 flex-row items-center justify-start space-x-2 rounded-lg"
                                                style={{ minHeight: 44 }}
                                            >
                                                <View pointerEvents="none">
                                                    <CheckBox
                                                        value={ isChecked }
                                                        tintColors={{ true: "gray", false: "gray" }}
                                                        boxType="square"
                                                        lineWidth={1.5}
                                                        tintColor="#151518"
                                                        onCheckColor="#ffffff"
                                                        onFillColor="#133522"
                                                        onTintColor="#133522"
                                                        animationDuration={0.15}
                                                        style={{ height: 20, width: 20 }}
                                                    />
                                                </View>
                                                <Text className="flex-1 font-montserratMedium text-base text-baseGreen">{ item }</Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                ) : (
                                    filteredOptions.map((item: string, index: number) => (
                                        <TouchableOpacity
                                            key={ index }
                                            onPress={ () => handleSelectSingle(item) }
                                            activeOpacity={ 0.6 }
                                            accessibilityRole="radio"
                                            accessibilityState={{ selected: selectedValue === item }}
                                            accessibilityLabel={ item }
                                            className="h-auto w-full my-0.5 px-2 flex-row items-center justify-start rounded-lg"
                                            style={{ minHeight: 44 }}
                                        >
                                            <Text className="flex-1 font-montserratMedium text-base text-baseGreen">{ item }</Text>
                                        </TouchableOpacity>
                                    ))
                                ) }
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={ onToggleOpen }
                        className="py-1.5"
                    >
                        <View className="flex-row items-center justify-between">
                            <Text className="flex-1 text-base text-[#9ca3af]">{ collapsedText }</Text>
                            <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" />
                        </View>

                        { mode === "multi" && selectedValues.length > 0 && (
                            <>
                                <View className="h-[1px] w-full my-2 bg-gray-200" />
                                <View className="flex-row flex-wrap gap-2">
                                    { selectedValues.map((item: string) => (
                                        <View key={ item } className="px-3 py-1 rounded-lg bg-baseGreen">
                                            <Text className="font-montserratMedium text-xs text-white">{ item }</Text>
                                        </View>
                                    )) }
                                </View>
                            </>
                        ) }
                    </TouchableOpacity>
                ) }
            </View>
        </>
    );
};

export default SearchableDropdownComponent;
