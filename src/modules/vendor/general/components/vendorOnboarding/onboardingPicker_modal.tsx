import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { CloseCircle, SearchNormal1, TickCircle } from "iconsax-react-native";

export interface IPickerOption {
    label: string;
    value: string;
    sublabel?: string;
}

interface IProps {
    visible: boolean;
    title: string;
    options: IPickerOption[];
    selectedValue?: string;
    searchable?: boolean;
    onSelect: (option: IPickerOption) => void;
    onClose: () => void;
}

const OnboardingPickerModal: React.FC<IProps> = ({
    visible,
    title,
    options,
    selectedValue,
    searchable = true,
    onSelect,
    onClose,
}) => {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) { return options; }
        const q = query.trim().toLowerCase();
        return options.filter(
            (opt) => opt.label.toLowerCase().includes(q) || (opt.sublabel?.toLowerCase().includes(q) ?? false),
        );
    }, [options, query]);

    return (
        <Modal
            visible={ visible }
            transparent
            animationType="slide"
            onRequestClose={ onClose }
        >
            <Pressable className="flex-1 bg-black/50" onPress={ onClose }>
                <Pressable
                    onPress={ () => {} }
                    className="mt-auto rounded-t-3xl bg-white pt-3 max-h-[80%]"
                >
                    {/*==== Drag handle ====*/}
                    <View className="self-center h-1.5 w-12 rounded-full bg-gray-300" />

                    {/*==== Header ====*/}
                    <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
                        <Text className="font-montserratBold text-lg text-baseGreen">{ title }</Text>
                        <TouchableOpacity onPress={ onClose }>
                            <CloseCircle size={ 22 } color="#6b7280" variant="Bold" />
                        </TouchableOpacity>
                    </View>

                    {/*==== Search ====*/}
                    { searchable && (
                        <View className="mx-5 mt-2 h-12 px-3 flex-row items-center rounded-2xl bg-gray-50 border border-gray-100">
                            <SearchNormal1 size={ 18 } color="#6b7280" />
                            <TextInput
                                placeholder="Search…"
                                placeholderTextColor="#9ca3af"
                                className="ml-2 flex-1 font-montserratMedium text-sm text-black"
                                value={ query }
                                onChangeText={ setQuery }
                            />
                        </View>
                    ) }

                    {/*==== Options ====*/}
                    <FlatList
                        data={ filtered }
                        keyExtractor={ (item) => item.value }
                        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
                        keyboardShouldPersistTaps="handled"
                        renderItem={ ({ item }) => {
                            const isSelected = item.value === selectedValue;
                            return (
                                <TouchableOpacity
                                    onPress={ () => { onSelect(item); onClose(); } }
                                    activeOpacity={ 0.85 }
                                    className={ `mt-2 p-4 flex-row items-center justify-between rounded-2xl border ${ isSelected ? "border-baseGreen bg-baseGreen/[0.05]" : "border-transparent bg-gray-50" }` }
                                >
                                    <View className="flex-1">
                                        <Text className={ `font-montserratSemiBold text-sm ${ isSelected ? "text-baseGreen" : "text-black" }` }>
                                            { item.label }
                                        </Text>
                                        { item.sublabel && (
                                            <Text className="mt-0.5 text-xs text-gray-500">{ item.sublabel }</Text>
                                        ) }
                                    </View>
                                    { isSelected && <TickCircle size={ 20 } color="#133522" variant="Bold" /> }
                                </TouchableOpacity>
                            );
                        } }
                        ListEmptyComponent={ () => (
                            <View className="mt-8 items-center">
                                <Text className="text-sm text-gray-500">No matches.</Text>
                            </View>
                        ) }
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default OnboardingPickerModal;
