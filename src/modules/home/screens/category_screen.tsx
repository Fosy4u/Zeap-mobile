import { SafeAreaView, StatusBar, Text, View } from 'react-native'
import React, { Component } from 'react'

export class CategoryScreen extends Component {
  render() {
    return (
      <SafeAreaView>
        <StatusBar
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View className="h-auto w-full flex-row items-center justify-between">
          <View></View>
          <Text>All Categories</Text>
        </View>
      </SafeAreaView>
    )
  }
}

export default CategoryScreen;