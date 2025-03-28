import React from 'react'
import { View, Text } from 'react-native'
import IVendorProductDetails from '../models/vendorProductDetails_model';

interface IProps {
  product: IVendorProductDetails;
}

const VendorProductDescriptionComponent: React.FC<IProps> = ({ product }) => {
  return (
    <View className="mt-4">
      <Text className="leading-6">{ product?.description! }</Text>

      <View className="mt-1">
        <View className="h-auto w-full flex-row items-start justify-between">
          <Text>Product name:</Text>
          <Text className="w-[65%] font-medium text-right">{ product?.title! }</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Fabric:</Text>
          <Text className="font-medium">None</Text>
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

export default VendorProductDescriptionComponent;