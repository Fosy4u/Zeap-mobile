import React from 'react'
import { View, Text } from 'react-native'
import IProductDetails from '../models/productDetails_model'

interface IProps {
  product: IProductDetails;
}

const DescriptionComponent: React.FC<IProps> = ({ product }) => {
  return (
    <View className="mt-4">
      <Text className="leading-6">{ product.description }</Text>

      <View className="mt-1">
        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Product name:</Text>
          <Text className="font-medium">{ product.title }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Fabric:</Text>
          <Text className="font-medium">None</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Color:</Text>
          <Text className="font-medium">{ product!.colors![0]?.value! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Brand:</Text>
          <Text className="font-medium">{ product!.categories!.brand!.split("-").join(" ") }</Text>
        </View>
      </View>
    </View>
  )
}

export default DescriptionComponent;