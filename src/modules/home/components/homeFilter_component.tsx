import React from "react";
import { View, Image, Text } from "react-native";

export type IHomePageFilterComponent = {
  onClose?: () => void;
};

const HomePageFilterComponent = ({ onClose }: IHomePageFilterComponent) => {
  return (
    <View className="bg-white h-[600px] max-w-full max-h-full overflow-hidden w-[360px]">
      {/* <View className="absolute h-[90px] w-[360px]">
        <Image
          className="absolute top-0 left-0 h-[90px] w-[360px]"
          resizeMode="cover"
          // source={require("../assets/frame-14732.png")}
        />
        <View className="absolute top-[30px] left-[20px] h-[44px] w-[320px] flex flex-row justify-between">
          <View className="flex items-center justify-center bg-[rgba(248,249,254,0.1)] p-[6px_10px] rounded-[16px]">
            <Image
              className="h-[24px] w-[24px]"
              resizeMode="cover"
              // source={require("../assets/shopping--outline.png")}
            />
            <Image
              className="w-[6px] h-[6px] mt-2"
              resizeMode="cover"
              // source={require("../assets/ellipse-618.png")}
            />
          </View>
          <View className="flex items-center justify-center bg-[rgba(248,249,254,0.1)] p-[6px_10px] rounded-[16px]">
            <Image
              className="h-[24px] w-[24px]"
              resizeMode="cover"
              // source={require("../assets/home--solid1.png")}
            />
            <Image
              className="w-[6px] h-[6px] mt-2"
              resizeMode="cover"
              // source={require("../assets/ellipse-6181.png")}
            />
          </View>
          <View className="flex items-center justify-center bg-[rgba(248,249,254,0.1)] p-[6px_10px] rounded-[16px]">
            <Image
              className="h-[24px] w-[24px]"
              resizeMode="cover"
              // source={require("../assets/favorite--outline2.png")}
            />
            <Image
              className="w-[6px] h-[6px] mt-2"
              resizeMode="cover"
              // source={require("../assets/ellipse-618.png")}
            />
          </View>
          <View className="flex items-center justify-center bg-[rgba(248,249,254,0.1)] p-[6px_10px] rounded-[16px]">
            <Image
              className="h-[24px] w-[24px]"
              resizeMode="cover"
              // source={require("../assets/profile--outline3.png")}
            />
            <Image
              className="w-[6px] h-[6px] mt-2"
              resizeMode="cover"
              // source={require("../assets/ellipse-618.png")}
            />
          </View>
        </View>
      </View>
      <View className="absolute h-[137px] top-[295px] left-[319px] w-[46px] hidden">
        <View className="absolute top-[36px] left-[11px] h-[66px] w-[35px]">
          <Image
            className="absolute top-0 h-[66px] w-[35px]"
            resizeMode="cover"
            // source={require("../assets/ellipse-621.png")}
          />
          <View className="absolute top-[18px] left-[23px] h-[29px] w-[7px]">
            <View className="absolute top-0 h-[29px] w-[7px] bg-[#d9d9d9] border-[0.1px] border-solid border-[#000] rounded-[15px]" />
            <Text className="absolute top-[25px] left-[2px] text-[4px] text-left text-[#272b36] transform rotate-[-90deg]">
              Colors
            </Text>
            <Text className="absolute top-[11px] left-[2px] text-[3px] text-left text-[#272b36] transform rotate-[-90deg]">
              Sizes
            </Text>
          </View>
          <Image
            className="absolute top-[29px] left-[2px] h-[7px] w-[7px]"
            resizeMode="cover"
            // source={require("../assets/group-157.png")}
          />
          <Image
            className="absolute top-[13px] left-[8px] h-[7px] w-[7px]"
            resizeMode="cover"
            // source={require("../assets/group-158.png")}
          />
          <Image
            className="absolute top-[47px] left-[8px] h-[7px] w-[7px]"
            resizeMode="cover"
            // source={require("../assets/group-160.png")}
          />
          <Image
            className="absolute top-[2px] left-[24px] h-[7px] w-[7px]"
            resizeMode="cover"
            // source={require("../assets/group-159.png")}
          />
          <Image
            className="absolute top-[57px] left-[24px] h-[7px] w-[7px]"
            resizeMode="cover"
            // source={require("../assets/group-161.png")}
          />
        </View>
        <Image
          className="absolute top-0 left-0 h-[137px] w-[41px]"
          resizeMode="cover"
          // source={require("../assets/frame-14630.png")}
        />
      </View>
      <View className="absolute top-[32px] left-[20px] h-[538px]">
        <View>
          <View>
            <View className="h-[34px] w-[320px] flex flex-row justify-between">
              <Text className="text-[24px] leading-[34px] text-black w-[280px]">
                Filter
              </Text>
              <Image
                className="absolute top-[5px] right-0 h-[24px] w-[24px]"
                resizeMode="cover"
                // source={require("../assets/cancel.png")}
              />
            </View>
            <Text className="mt-3 text-[16px] text-[#272b36] w-[320px]">
              Filter your search with the following
            </Text>
          </View>
          <View className="mt-8">
            <View>
              <Text className="text-[#1a1a1a] text-[14px] font-medium w-[320px]">
                Clothing type
              </Text>
              <View className="mt-4 flex flex-row">
                <View className="flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Ready-made</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Tailor sewn</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] hidden">
                  <Text className="text-[#1a1a1a] text-[12px]">Child</Text>
                </View>
              </View>
            </View>
            <View className="mt-8">
              <Text className="text-[#1a1a1a] text-[14px] font-medium w-[320px]">
                Clothing category male
              </Text>
              <View className="mt-4 flex flex-row">
                <View className="flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Adult</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Boy</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Girl</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Female</Text>
                </View>
              </View>
            </View>
            <View className="mt-8">
              <Text className="text-[#1a1a1a] text-[14px] font-medium w-[320px]">
                Clothing category female
              </Text>
              <View className="mt-4 flex flex-row">
                <View className="flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Adult</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Boy</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Girl</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Female</Text>
                </View>
              </View>
            </View>
            <View className="mt-8">
              <Text className="text-[#1a1a1a] text-[14px] font-medium w-[320px]">
                Clothing material
              </Text>
              <View className="mt-4 flex flex-row">
                <View className="flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Cotton</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8]">
                  <Text className="text-[#1a1a1a] text-[12px]">Polyester</Text>
                </View>
                <View className="ml-4 flex items-center justify-center bg-[#f8f9fe] p-[11px_16px] rounded-[8px] border-[1px] border-solid border-[#e0e2e8] hidden">
                  <Text className="text-[#1a1a1a] text-[12px]">Linen</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="mt-8 flex flex-row">
            <View className="flex items-center justify-center w-[140px] h-[40px] bg-[#101828] rounded-[8px]">
              <Text className="text-[14px] font-semibold text-white">Apply</Text>
            </View>
            <View className="ml-4 flex items-center justify-center w-[140px] h-[40px] bg-[#f8f9fe] border-[1px] border-solid border-[#d0d5dd] rounded-[8px]">
              <Text className="text-[14px] font-semibold text-[#344054]">
                Cancel
              </Text>
            </View>
          </View>
        </View>
      </View> */}
    </View>
  );
};

export default HomePageFilterComponent;
