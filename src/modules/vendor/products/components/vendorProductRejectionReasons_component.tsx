import React from 'react';
import { View, Text } from 'react-native';
import { InfoCircle } from 'iconsax-react-native';

interface IProps {
  rejectionReasons?: any[];
}

const getReasonText = (reason: any): string => {
  if (!reason) return "";
  if (typeof reason === "string") return reason;
  return (
    reason.reason ||
    reason.message ||
    reason.description ||
    reason.text ||
    reason.comment ||
    reason.title ||
    ""
  );
};

const VendorProductRejectionReasonsComponent: React.FC<IProps> = ({ rejectionReasons }) => {
  const reasons = (rejectionReasons ?? [])
    .map(getReasonText)
    .filter((text) => !!text);

  return (
    <View className="h-auto w-full mt-4 p-4 border border-red-200 rounded-2xl bg-red-50">
      <View className="flex-row items-center">
        <InfoCircle size={ 20 } color="#DC2626" variant="Bold" />
        <Text className="ml-2 font-montserratSemiBold text-base text-red-600">Product Rejected</Text>
      </View>

      <Text className="mt-2 font-montserratRegular text-sm text-gray-700 leading-5">
        Unfortunately, your product did not meet all of the required guidelines. Please review the
        reasons below and make the necessary corrections before resubmitting.
      </Text>

      <Text className="mt-3 font-montserratRegular text-sm text-gray-700 leading-5">
        Once you have addressed the issues, you can resubmit your product again for review.
      </Text>

      {/*==== Reasons ====*/}
      { reasons.length > 0 && (
        <View className="mt-3 gap-y-2">
          { reasons.map((reason, index) => (
            <View
              key={ index }
              className="h-auto w-full p-3 flex-row items-center border border-red-200/70 rounded-xl bg-white"
            >
              <InfoCircle size={ 18 } color="#DC2626" variant="Bold" />
              <Text className="ml-2 flex-1 font-montserratMedium text-sm text-gray-700">{ reason }</Text>
            </View>
          )) }
        </View>
      ) }

      <View className="h-[1px] w-full mt-4 bg-red-200/70" />
      <Text className="mt-3 font-montserratRegular text-xs text-gray-600 leading-5">
        💡 Once you've addressed these issues, you can resubmit your product for review. Our team
        will recheck it promptly.
      </Text>
    </View>
  );
};

export default VendorProductRejectionReasonsComponent;
