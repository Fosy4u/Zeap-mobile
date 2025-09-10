import React from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import HTMLView from 'react-native-htmlview';
import IProductDetails from '../models/productDetails_model'

interface IProps {
  product: IProductDetails;
}

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
          <Text className="w-[65%] font-montserratMedium text-right text-gray-700">{ product?.title! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Group:</Text>
          <Text className="font-montserratMedium text-gray-700">{ product?.categories?.productGroup! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Design:</Text>
          <View className="flex-row justify-end">
            {product.categories?.design && product.categories?.design.length > 0 ? (
              product.categories.design.map((design: string, index: number) => (
                <Text key={index} className="font-montserratMedium text-gray-700">
                  {design}
                  {index !== (product.categories?.design?.length ?? 0) - 1 && ', '}
                </Text>
              ))
            ) : (
              <Text className="font-montserratMedium">N/A</Text>
            ) }
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Style:</Text>
          <View className="flex-row justify-end">
            {product.categories?.style &&
              product.categories.style.map((style: string, index: number) => (
                <Text key={index} className="font-montserratMedium text-gray-700">
                  {style}
                  {index !== (product.categories?.style?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Occasion:</Text>
          <View className="flex-row justify-end">
            {product.categories?.occasion &&
              product.categories.occasion.map((occasion: string, index: number) => (
                <Text key={index} className="font-montserratMedium text-gray-700">
                  {occasion}
                  {index !== (product.categories?.occasion?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Sleeve:</Text>
          <Text className="font-montserratMedium text-gray-700">{ product?.categories?.sleeveLength || "N/A" }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Fastening:</Text>
          <View className="flex-1 flex-row justify-end">
            {product.categories?.fastening &&
              product.categories.fastening.map((fastening: string, index: number) => (
                <Text key={index} className="font-montserratMedium text-gray-700">
                  {fastening || "N/A"}
                  {index !== (product.categories?.fastening?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Color:</Text>
          {/* <Text className="font-medium">{ product?.colors![0]?.value! }</Text> */}
          <Text className="font-montserratMedium text-gray-700">{ product?.colors?.[0]?.value! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Brand:</Text>
          <Text className="font-montserratMedium text-gray-700">{ product?.categories?.brand?.split("-").join(" ") }</Text>
        </View>
      </View>
    </View>
  )
}

export default DescriptionComponent;