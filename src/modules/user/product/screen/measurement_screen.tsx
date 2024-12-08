import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowDown2, ArrowLeft, ArrowRight } from 'iconsax-react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CheckBox from '@react-native-community/checkbox';
import SavedMeasurementsModal from '../modals/saved_measurements_modal';

const MeasurementScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();

  const [selectedUnit, setSelectedUnit] = useState("in");
  const [saveMeasurementForNextTime, setSaveMeasurementForNextTime] = useState(false);
  const [showSavedMeasurementModal, setShowSavedMeasurementModal] = useState(false);
  const unitOptions = [
      { "key": "in", "value": "in" },
      { "key": "cm", "value": "cm" },
  ];

  const handleShowSavedMeasurementModal = (value: boolean) => {
    setShowSavedMeasurementModal(value);
  };
  
  return (
    <SafeAreaView className="h-full w-full relative flex-1 pt-[15px] bg-lightGray">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-[20px] flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-semibold text-lg text-baseGreen">Measurement</Text>
        <View className="h-[40px] w-[40px]" />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="pt-[30px] pb-5 px-[20px]">
          <Text className="font-normal text-2xl text-gray-700">Kindly provide us your measurement</Text>

          <TouchableOpacity 
            onPress={ () => handleShowSavedMeasurementModal(true) }
            className="h-[55px] w-full mt-6 flex-row items-center justify-center rounded-xl bg-lightGold"
          >
            <Text className="font-normal text-base text-green-800">Apply Existing Measurement</Text>
          </TouchableOpacity>

          <Text className="mt-4 font-medium text-center">OR</Text>

          <Text className="mt-3 font-medium text-base text-center text-gray-700">Enter new measurement</Text>

          <View className="h-auto w-full mt-5 px-3 py-4 relative border border-gray-200 rounded-2xl">
            <Text className="mt-2 font-medium text-base text-gray-700">Blazers</Text>
            <View className="h-auto w-[60px] absolute p-2 top-4 right-3 border border-gray-200 bg-gray-100 rounded-lg z-50">
              <SelectList
                setSelected={ setSelectedUnit }
                data={ unitOptions }
                // maxHeight={100}
                boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                search={ false }
                placeholder="in"
              />
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Neck</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Chest</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Sleeve</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Waist</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Belly</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Arm</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Shoulder</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Body length</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Neck</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>
          </View>

          <View className="h-auto w-full mt-7 px-3 py-4 relative border border-gray-200 rounded-2xl">
            <Text className="mt-2 font-medium text-base text-gray-700">Trouser</Text>
            <View className="h-auto w-[60px] absolute p-2 top-4 right-3 border border-gray-200 bg-gray-100 rounded-lg z-50">
              <SelectList
                setSelected={ setSelectedUnit }
                data={ unitOptions }
                // maxHeight={100}
                boxStyles={{ height: 25, width: "auto", paddingVertical: 0, paddingHorizontal: 0, borderColor: "transparent" }}
                inputStyles={{ fontSize: 16, color: "#9ca3af" }}
                dropdownStyles={{ height: "auto", width: "auto", paddingTop: 0, borderColor: "transparent" }}
                dropdownItemStyles={{ paddingHorizontal: 5, paddingTop: 3, paddingBottom: 0 }}
                arrowicon={ <ArrowDown2 size={18} color="#9ca3af" className="mx-1 mt-1" /> }
                search={ false }
                placeholder="in"
              />
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Waist</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Thigh</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Trouser length</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Foot</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>

            <Text aria-label="Height" nativeID="height" className="mt-4">Calf</Text>
            <View className="h-auto w-full mt-1.5 px-3 flex flex-row items-center  justify-between border border-gray-300 rounded-xl bg-gray-100">
              <TextInput
                aria-label="Height"
                aria-labelledby="height"
                keyboardType="phone-pad"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                onChangeText={(value) => null}
              />
              <View className="h-auto w-[40px] flex-row items-center">
                <View className="h-[30px] w-[1] mr-2 bg-slate-300" />
                <Text>{ selectedUnit }</Text>
              </View>
            </View>
          </View>

          <View className="mt-5 flex-row items-center">
            <CheckBox
              value={ saveMeasurementForNextTime }
              onValueChange={ (newValue) => setSaveMeasurementForNextTime(newValue) }
              tintColors={{ true: "#133522", false: "#151518" }}
            />
            <Text className="ml-2 text-lg">Save my measurement for next time</Text>
          </View>

          <TouchableOpacity 
            onPress={ () => navigation.navigate("homeScreen") }
            className="h-[55px] w-auto mt-5 flex flex-row items-center justify-center rounded-xl bg-baseGreen"
          >
            <Text className="text-lg text-white mr-2">Proceed</Text>
            <ArrowRight className="text-white" />
          </TouchableOpacity>
        </View>   
      </ScrollView>

      { (showSavedMeasurementModal === true) && (
        <SavedMeasurementsModal handleShowSavedMeasurementModal={ handleShowSavedMeasurementModal } />
      ) }
      
    </SafeAreaView>
  )
}

export default MeasurementScreen;