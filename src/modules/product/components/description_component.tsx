import React from 'react'
import { View, Text } from 'react-native'

const DescriptionComponent = () => {
  return (
    <View className="mt-4">
      <Text>Lorem ipsum dolor sit amet consectetur. Eget scelerisque mus blandit 
        euismod pellentesque a elit ultrices. Ut eu auctor tortor cras. Senectus 
        pretium at urna et vitae sit. Orci lorem egestas bibendum risus consequat 
        tincidunt sed adipiscing sollicitudin. Pharetra iaculis lacus diam 
        sagittis bibendum. Senectus morbi in porttitor ultricies vestibulum.
      </Text>

      <View className="mt-1">
        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Product name:</Text>
          <Text className="font-medium">Female Jumper Suit</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Fabric:</Text>
          <Text className="font-medium">Cutton</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Color:</Text>
          <Text className="font-medium">Green</Text>
        </View>

        <View className="h-auto w-full mt-3 flex-row items-center justify-between">
          <Text>Brand:</Text>
          <Text className="font-medium">Product Brand</Text>
        </View>
      </View>
    </View>
  )
}

export default DescriptionComponent;