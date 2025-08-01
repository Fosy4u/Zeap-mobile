import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'iconsax-react-native';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View, Image } from 'react-native';
import RootNavigationStackModel from '../../../routes/model/routes_model';
import EnglishFlag from '../../../../assets/images/flags/english_flag.png';
import GermanFlag from '../../../../assets/images/flags/german_flag.png';
import FrenchFlag from '../../../../assets/images/flags/french_flag.png';

const LanguageSettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const languages = [
    { name: 'English', flag: EnglishFlag, selected: true },
    { name: 'German', flag: GermanFlag, selected: false },
    { name: 'Chinese', flag: FrenchFlag, selected: false },
  ];
    
  return (
    <SafeAreaView className="h-full w-full flex-1 bg-white">
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      
      {/*==== Header ====*/}
      <View className="h-auto w-full px-5 pt-5 pb-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={ () => navigation.pop() }>
          <View className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-baseGreen">
            <ArrowLeft color="white" />
          </View>
        </TouchableOpacity>
        <Text className="font-montserratSemiBold text-lg text-baseGreen">Language Settings</Text>
        <View className="h-[40px] w-[40px]" />
      </View>

      {/*==== Content ====*/}
      <ScrollView showsVerticalScrollIndicator={ false }>
        <View className="px-5 pt-5 pb-20">
          <Text className="font-montserratMedium text-gray-600 text-base mb-6">Select your preferred language choice</Text>
          
          {languages.map((language, index) => (
            <LanguageCardItem
              key={index}
              language={language}
              isSelected={selectedLanguage === language.name}
              onPress={() => setSelectedLanguage(language.name)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LanguageSettingsScreen;



interface ILanguageCardItemProps {
  language: {
    name: string;
    flag: any;
    selected: boolean;
  };
  isSelected: boolean;
  onPress: () => void;
}

const LanguageCardItem = (props: ILanguageCardItemProps) => {
  const { language, isSelected, onPress } = props;
  
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="h-auto w-full mb-4 flex-row items-center justify-between py-3">
        <View className="h-auto w-fit flex-row items-center gap-x-4">
          <View className="h-[55px] w-[55px] flex items-center justify-center rounded-xl border border-[#EDEFF4] bg-[#F8F9FE]">
            <Image 
              source={language.flag}
              className="h-5 w-5 rounded"
              resizeMode="contain"
            />
          </View>
          <Text className="font-montserratMedium text-base text-gray-800">{language.name}</Text>
        </View>
        <View className={`h-5 w-5 rounded-md ${isSelected ? 'bg-baseGreen' : 'bg-gray-300'}`} />
      </View>
    </TouchableOpacity>
  );
};