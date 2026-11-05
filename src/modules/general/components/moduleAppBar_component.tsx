import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  title: string;
  variant?: "vendor" | "buyer";
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

const ModuleAppBarComponent: React.FC<IProps> = ({
  title,
  variant = "buyer",
  rightIcon,
  onRightPress,
}) => {
  const isVendor = variant === "vendor";

  return (
    <View
      className={ `h-auto w-full px-5 pt-5 pb-3 ${ isVendor ? "rounded-b-3xl bg-baseGreen" : "" }` }
    >
      <View className="h-auto w-full flex-row items-center justify-between">
        <View className="h-[40px] w-[40px]" />

        <Text
          className={ `font-semibold text-lg ${ isVendor ? "text-white" : "text-baseGreen" }` }
          numberOfLines={ 1 }
        >
          { title }
        </Text>

        { rightIcon ? (
          <TouchableOpacity
            onPress={ onRightPress }
            className={ `p-2.5 rounded-full ${ isVendor ? "bg-[#20704329]" : "bg-lightGreen" }` }
          >
            { rightIcon }
          </TouchableOpacity>
        ) : (
          <View className="h-[40px] w-[40px]" />
        ) }
      </View>
    </View>
  );
};

export default ModuleAppBarComponent;
