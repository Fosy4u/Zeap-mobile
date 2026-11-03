import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLazyGetProductBodyMeasurementsQuery } from '../apis/bespokeProduct_api';

const titleCase = (text: string) =>
    text.split(" ").map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(" ");

const VendorProductMeasurementsComponent: React.FC<{ productId: string }> = ({ productId }) => {
    const [getProductBodyMeasurements, { data, isFetching }] = useLazyGetProductBodyMeasurementsQuery();

    useEffect(() => {
        if (productId) getProductBodyMeasurements(productId);
    }, [productId]);

    const measurements = (data?.measurements ?? []).filter((measurement) => (measurement.fields?.length ?? 0) > 0);
    const additionalNote = ((data as any)?.additionalMeasurementNote ?? "").trim();

    return (
        <>
            {/*==== Selected Measurements ====*/}
            <View className="h-auto w-full mt-6 px-4 py-4 border border-gray-200 rounded-xl bg-lightGray">
                <Text className="font-montserratSemiBold text-base text-gray-700">Selected Measurements</Text>

                { isFetching && !data ? (
                    <ActivityIndicator className="mt-4 self-start" color="#133522" />
                ) : measurements.length === 0 ? (
                    <Text className="mt-3 font-montserratMedium text-sm text-gray-500">No measurements selected for this product.</Text>
                ) : (
                    measurements.map((measurement) => (
                        <View key={ measurement._id ?? measurement.name } className="mt-4">
                            <Text className="font-montserratSemiBold text-sm text-baseGreen">{ titleCase(measurement.name ?? "") }</Text>
                            <View className="mt-2 flex-row flex-wrap" style={{ columnGap: 6, rowGap: 6 }}>
                                { measurement.fields!.map((field) => (
                                    <View key={ field } className="px-2.5 py-1 rounded-full bg-lightGreen">
                                        <Text className="font-montserratMedium text-xs text-baseGreen">{ titleCase(field) }</Text>
                                    </View>
                                )) }
                            </View>
                        </View>
                    ))
                ) }
            </View>

            {/*==== Additional Instructions ====*/}
            <View className="h-auto w-full mt-4 px-4 py-4 border border-gray-200 rounded-xl bg-lightGray">
                <Text className="font-montserratSemiBold text-base text-gray-700">Additional Instructions</Text>
                <Text className="mt-2 font-montserratMedium text-sm text-gray-600 leading-5">
                    { additionalNote || "No additional instructions." }
                </Text>
            </View>
        </>
    );
};

export default VendorProductMeasurementsComponent;
