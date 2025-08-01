import React from 'react'
import { View, Text } from 'react-native'
import IProductDetails from '../models/productDetails_model'

interface IProps {
  product: IProductDetails;
}

const DescriptionComponent: React.FC<IProps> = ({ product }) => {
  return (
    <View className="mt-4">
      <Text className="leading-6">{ product?.description! }</Text>

      <View className="mt-1">
        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Product name:</Text>
          <Text className="w-[65%] font-medium text-right">{ product?.title! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Group:</Text>
          <Text className="w-[65%] font-medium text-right">{ product?.categories?.productGroup! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Design:</Text>
          <View className="flex-1 flex-row justify-end">
            {product.categories?.design &&
              product.categories.design.map((design: string, index: number) => (
                <Text key={index} className="font-medium">
                  {design}
                  {index !== (product.categories?.design?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Style:</Text>
          <View className="flex-1 flex-row justify-end">
            {product.categories?.style &&
              product.categories.style.map((style: string, index: number) => (
                <Text key={index} className="font-medium">
                  {style}
                  {index !== (product.categories?.style?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Occasion:</Text>
          <View className="flex-1 flex-row justify-end">
            {product.categories?.occasion &&
              product.categories.occasion.map((occasion: string, index: number) => (
                <Text key={index} className="font-medium">
                  {occasion}
                  {index !== (product.categories?.occasion?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Fabric:</Text>
          <Text className="font-medium">None</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Sleeve:</Text>
          <Text className="w-[65%] font-medium text-right">{ product?.categories?.sleeveLength! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-start justify-between">
          <Text>Fastening:</Text>
          <View className="flex-1 flex-row justify-end">
            {product.categories?.fastening &&
              product.categories.fastening.map((fastening: string, index: number) => (
                <Text key={index} className="font-medium">
                  {fastening}
                  {index !== (product.categories?.fastening?.length ?? 0) - 1 && ', '}
                </Text>
              ))}
          </View>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Color:</Text>
          {/* <Text className="font-medium">{ product?.colors![0]?.value! }</Text> */}
          <Text className="font-medium">{ product?.colors?.[0]?.value! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Brand:</Text>
          <Text className="font-medium">{ product?.categories?.brand?.split("-").join(" ") }</Text>
        </View>
      </View>
    </View>
  )
}

export default DescriptionComponent;