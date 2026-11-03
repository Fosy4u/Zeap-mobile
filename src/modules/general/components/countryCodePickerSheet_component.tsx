import React, { useMemo, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchNormal1 } from 'iconsax-react-native';
import countriesPhoneCodes from '../../../utils/countriesPhoneCodes.json';

export type ICountryPhoneCode = typeof countriesPhoneCodes[number];

interface IProps {
    visible: boolean;
    selectedCountryCode?: string;
    onSelect: (country: ICountryPhoneCode) => void;
    onClose: () => void;
}

const CountryCodePickerSheet: React.FC<IProps> = ({ visible, selectedCountryCode, onSelect, onClose }) => {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const [searchPhrase, setSearchPhrase] = useState("");

    const filteredCountries = useMemo(() => {
        const phrase = searchPhrase.trim().toLowerCase();
        if (!phrase) return countriesPhoneCodes;
        return countriesPhoneCodes.filter((country) =>
            country.name.toLowerCase().includes(phrase)
            || country.dial_code.includes(phrase)
            || country.code.toLowerCase() === phrase
        );
    }, [searchPhrase]);

    const handleClose = () => {
        setSearchPhrase("");
        onClose();
    };

    return (
        <Modal visible={ visible } transparent animationType="slide" statusBarTranslucent onRequestClose={ handleClose }>
            <KeyboardAvoidingView behavior={ Platform.OS === "ios" ? "padding" : undefined } className="flex-1 justify-end bg-black/40">
                <TouchableOpacity activeOpacity={ 1 } onPress={ handleClose } className="flex-1" />
                <View className="w-full px-5 pt-3 rounded-t-3xl bg-white" style={{ height: height * 0.75, paddingBottom: insets.bottom + 12 }}>
                    <View className="h-[5px] w-[44px] self-center rounded-full bg-gray-300" />

                    <View className="mt-4 flex-row items-center justify-between">
                        <Text className="font-montserratSemiBold text-lg text-gray-800">Select Country Code</Text>
                        <TouchableOpacity onPress={ handleClose } hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Image className="h-[22px] w-[22px]" style={{ tintColor: "#6B7280" }} source={ require("../../../../assets/images/close.png") } />
                        </TouchableOpacity>
                    </View>

                    <View className="mt-4 px-3 flex-row items-center border border-gray-300 rounded-xl bg-gray-100">
                        <SearchNormal1 size={ 18 } color="#9ca3af" />
                        <TextInput
                            value={ searchPhrase }
                            onChangeText={ setSearchPhrase }
                            placeholder="Search country or code"
                            placeholderTextColor="#9ca3af"
                            autoCorrect={ false }
                            className="h-[44px] ml-2 flex-1 text-base"
                        />
                    </View>

                    <FlatList
                        data={ filteredCountries }
                        keyExtractor={ (country) => country.code }
                        keyboardShouldPersistTaps="handled"
                        className="mt-3"
                        ListEmptyComponent={ <Text className="mt-6 text-center text-sm text-gray-400">No country matches "{ searchPhrase }".</Text> }
                        renderItem={ ({ item: country }) => {
                            const isSelected = country.code === selectedCountryCode;
                            return (
                                <TouchableOpacity
                                    onPress={ () => {
                                        onSelect(country);
                                        handleClose();
                                    } }
                                    className={ `px-3 py-3 flex-row items-center rounded-lg ${ isSelected ? "bg-lightGreen" : "" }` }
                                >
                                    <Text className="text-lg">{ country.emoji }</Text>
                                    <Text className="ml-3 flex-1 font-montserratMedium text-sm text-gray-800">{ country.name }</Text>
                                    <Text className="ml-2 font-montserratMedium text-sm text-gray-500">{ country.dial_code }</Text>
                                </TouchableOpacity>
                            );
                        } }
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CountryCodePickerSheet;
