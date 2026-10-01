import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import { ArrowRight2 } from 'iconsax-react-native';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { RootState } from '../../../../redux/store/store';
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp.tsx';
import MeasurementSkeletonLoader from '../components/measurementSkeletonLoader_component.tsx';
import useMeasurementHook from '../hooks/measurement_hook';
import { setSelectedMeasurementTemplate } from '../slices/measurement_slice';
import IBodyMeasurement from '../models/bodyMeasurement_model';

const titleCase = (value?: string | null) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
};

/* Flatten a template's measurements (legacy nested or flat shape) into a
   uniform [{ field, value }] list for the preview. */
const flattenMeasurements = (template?: IBodyMeasurement): any[] => {
    const raw: any[] = (template?.measurements as any[]) ?? [];
    const isFlat = raw.length > 0 && raw[0]?.field !== undefined && raw[0]?.measurements === undefined;
    return isFlat ? raw : raw.flatMap((group: any) => group?.measurements ?? []);
};

/* Full-screen saved-measurements list for the profile flow. Product flows keep
   using measurementScreen, where a template is filled against a product. */
const SavedMeasurementsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    const { allSavedMeasurements, isLoading } = useSelector((state: RootState) => state.measurementState);

    const { handleGetAllSavedMeasurements } = useMeasurementHook();

    useEffect(() => {
        handleGetAllSavedMeasurements();
    }, []);

    const handleOpenTemplate = (template: IBodyMeasurement) => {
        dispatch(setSelectedMeasurementTemplate(template));
        navigation.navigate("editMeasurementTemplateScreen");
    };

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-white">
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            {/*==== Header ====*/}
            <AppHeaderComp title="Saved Measurements" />

            <ScrollView
                showsVerticalScrollIndicator={ false }
                className="flex-1 w-full"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            >
                <Text className="pt-[24px] pb-1 font-montserratMedium text-xl text-gray-700">
                    Your saved measurements
                </Text>

                { isLoading && allSavedMeasurements.length === 0 ? (
                    <View className="pt-[20px]">
                        <MeasurementSkeletonLoader />
                    </View>
                ) : allSavedMeasurements.length === 0 ? (
                    <View className="h-auto w-full mt-5 p-10 bg-gray-50 rounded-xl">
                        <FastImage
                            source={ require("../../../../../assets/images/empty_box.png") }
                            defaultSource={ require("../../../../../assets/images/empty_box.png") }
                            resizeMode={ FastImage.resizeMode.contain }
                            className="h-[70px] w-full"
                        />
                        <Text className="mt-4 text-center text-gray-400">
                            You haven't saved any measurement yet. Measurements you save while ordering a bespoke product will appear here.
                        </Text>
                    </View>
                ) : (
                    allSavedMeasurements.map((template) => {
                        const items = flattenMeasurements(template);
                        const preview = items.slice(0, 4);
                        const remaining = Math.max(items.length - 4, 0);
                        return (
                            <TouchableOpacity
                                key={ template._id }
                                activeOpacity={ 0.9 }
                                onPress={ () => handleOpenTemplate(template) }
                                className="h-auto w-full mt-3 px-4 py-4 border border-gray-200 rounded-xl bg-[#F8F9FE]"
                            >
                                <View className="flex-row items-center justify-between">
                                    <Text className="flex-1 font-montserratSemiBold text-base text-gray-700">{ template.templateName ?? "Untitled" }</Text>
                                    <ArrowRight2 size={ 18 } color="#9ca3af" />
                                </View>

                                <View className="mt-2 flex-row flex-wrap">
                                    { preview.map((item: any, idx: number) => (
                                        <View key={ item?._id ?? `mi-${idx}` } className="w-1/2 mt-2 pr-3">
                                            <Text className="font-Montserrat text-xs text-gray-500" numberOfLines={ 1 }>{ titleCase(item?.field) || "Field" }</Text>
                                            <Text className="mt-0.5 font-montserratMedium text-sm text-gray-800" numberOfLines={ 1 }>{ item?.value ?? "" }</Text>
                                        </View>
                                    )) }
                                </View>
                                { remaining > 0 && (
                                    <Text className="mt-2 font-montserratMedium text-xs text-gray-500">+{ remaining } more</Text>
                                ) }
                            </TouchableOpacity>
                        );
                    })
                ) }
            </ScrollView>
        </SafeAreaView>
    );
};

export default SavedMeasurementsScreen;
