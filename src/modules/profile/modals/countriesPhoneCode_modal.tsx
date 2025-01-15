import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { setSelectedCountry, setSelectedPhoneCode, setShowCountryModal, setShowPhoneCodeModal } from '../slices/profileState_slice';
import SelectDropdown from 'react-native-select-dropdown';
import useEditAccountDetailsHook from '../hooks/editAccountDetails_hook';

interface IProps {
    option: string;
};

const CountriesPhoneCodeModal: React.FC<IProps> = ({ option }) => {
    const { phoneCodeOptions } = useSelector((state: RootState) => state.profileState);
    const dispatch = useDispatch();
    const dropdownRef = useRef<SelectDropdown>(null);

    const { setCountryValue } = useEditAccountDetailsHook();
    

    useEffect(() => {
        if (dropdownRef.current) {
            dropdownRef.current.openDropdown();
        }
    }, []);
    

    return (
        <SafeAreaView className="h-full w-full absolute inset-0 flex items-center justify-center">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />
            
            <View className="h-[450px] w-[320px]">

                <SelectDropdown
                    ref={dropdownRef}
                    data={ phoneCodeOptions }
                    search={true}
                    searchPlaceHolder="Type country name"
                    showsVerticalScrollIndicator={false}
                    onSelect={ (selectedItem) => {
                        dispatch(setSelectedPhoneCode(selectedItem));
                        dispatch(setSelectedCountry(selectedItem.name));

                        // Close dropdown
                        if (dropdownRef.current) {
                            dropdownRef.current.closeDropdown();
                            dispatch(setShowPhoneCodeModal(false));
                            dispatch(setShowCountryModal(false));
                        }
                    } }
                    onBlur={ () => {
                        requestAnimationFrame(() => {
                            if (dropdownRef.current) {
                                dropdownRef.current.closeDropdown();
                                dispatch(setShowPhoneCodeModal(false));
                                dispatch(setShowCountryModal(false));
                            }
                        });
                    } }
                    dropdownStyle={{
                        minHeight: 450,
                        minWidth: 320,
                        backgroundColor: "#faf5f5",
                        borderRadius: 8,
                    }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <></>
                        );
                    }}
                    renderItem={(item, _, isSelected) => {
                        return (
                            <>
                                <View className={`h-auto w-full px-2 py-2 flex-row items-start justify-between ${isSelected && "bg-lightGreen"}`}>
                                    <View className="flex-row gap-x-2">
                                        <Text>{ item.emoji }</Text>
                                        <Text>{item.name}</Text>
                                    </View>

                                    <Text>{ option === "PhoneCodes" && item.dial_code}</Text>
                                </View>
                            </>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

export default CountriesPhoneCodeModal