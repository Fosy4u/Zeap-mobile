import React from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import HTMLView from 'react-native-htmlview';
import IProductDetails from '../models/productDetails_model'
import FormatWords from '../../../../utils/formatWords';

interface IProps {
  product: IProductDetails;
}

const joinValues = (values?: (string | undefined)[] | null): string => {
  const filled = (values ?? []).filter(Boolean);
  return filled.length > 0 ? filled.join(", ") : "N/A";
};

const DescriptionComponent: React.FC<IProps> = ({ product }) => {
  const { width } = useWindowDimensions();

  return (
    <View className="mt-4">
      <View>
        {/* Render HTML description */}
        <HTMLView
          value={product?.description || "<p>No description available</p>"}
          stylesheet={{
            p: { color: "#374151", fontFamily: "Montserrat-Medium", fontSize: 13 }, // text-gray-700, text-xs
            h1: { fontFamily: "Montserrat-Medium", fontSize: 14, fontWeight: "bold" },
            a: { color: "#10B981", textDecorationLine: "none" }, // green-500
          }}
        />

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Product name:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product?.title! }</Text>
        </View>

        { !!product?.productId && (
          <View className="h-auto w-full mt-3 flex-row items-center justify-between">
            <Text>Product ID:</Text>
            <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product?.productId }</Text>
          </View>
        ) }

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Group:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ FormatWords.productGroupLabel(product?.categories?.productGroup, product?.productType) }</Text>
        </View>

        { !!product?.categories?.main?.length && (
          <View className="h-auto w-full mt-3 flex-row items-start justify-between">
            <Text>Main:</Text>
            <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product.categories.main.join(", ") }</Text>
          </View>
        ) }

        { !!product?.categories?.accessoryType && (
          <View className="h-auto w-full mt-3 flex-row items-center justify-between">
            <Text>Accessory:</Text>
            <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product.categories.accessoryType }</Text>
          </View>
        ) }

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Design:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">
            { joinValues(product.categories?.design) }
          </Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Style:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">
            { joinValues(product.categories?.style) }
          </Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Occasion:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">
            { joinValues(product.categories?.occasion) }
          </Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Sleeve:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product?.categories?.sleeveLength || "N/A" }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Fastening:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">
            { joinValues(product.categories?.fastening) }
          </Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Color:</Text>
          {/* <Text className="font-medium">{ product?.colors![0]?.value! }</Text> */}
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product?.colors?.[0]?.value! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Brand:</Text>
          <Text className="flex-1 ml-3 font-montserratMedium text-right text-gray-700">{ product?.categories?.brand?.split("-").join(" ") }</Text>
        </View>
      </View>
    </View>
  )
}

export default DescriptionComponent;