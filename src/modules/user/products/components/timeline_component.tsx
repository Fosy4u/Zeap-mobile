import React from 'react';
import { View, Text } from 'react-native';
import { ITimeLine } from '../models/productDetails_model';

interface IProps {
  productType: string;
}

const TimelineComponent: React.FC<IProps> = ({ productType }) => {


  interface ITimeLine {
    title: string;
    description: string;
    time: string;
  }

  // Already Made Timelines
  const readyMadeTimelines: ITimeLine[] = [
    {
      title: "Place Order",
      description: "Place your order online or contact us for assistance.",
      time: "2 days"
    },
    {
      title: "Order Confirmation",
      description: "We confirm your order and sort any clarifications.",
      time: "2 days"
    },
    {
      title: "Order Processing",
      description: "We process your order and prepare for dispatch.",
      time: "2 days"
    },
    {
      title: "Quality Check / Ready for Dispatch",
      description: "We check the quality of the cloth before dispatching.",
      time: "3 days"
    },
    {
      title: "Dispatch",
      description: "We dispatch the cloth to your location.",
      time: "2 days"
    },
    {
      title: "Delivery",
      description: "We deliver the cloth to your doorstep.",
      time: "3 days"
    },
    {
      title: "Feeback / Return",
      description: "We get feedback from you and accept returns if necessary.",
      time: "Anytime"
    }
  ];

  // Bespoke Timelines
  const bespokeTimelines: ITimeLine[] = [
    {
      title: "Submit Body Measurement / Place Order",
      description: "Submit your body measurements while placing order.",
      time: "2 days"
    },
    {
      title: "Order Confirmation",
      description: "We confirm your order and sort any clarifications.",
      time: "2 days"
    },
    {
      title: "Cutting",
      description: "Our tailors cut the fabric to your body measurements.",
      time: "2 days"
    },
    {
      title: "Sewing",
      description: "Our tailors sew the fabric to your body measurements.",
      time: "2 weeks"
    },
    {
      title: "Quality Check / Ready for Dispatch",
      description: "We check the quality of the cloth before dispatching.",
      time: "3 days"
    },
    {
      title: "Dispatch",
      description: "We dispatch the cloth to your location.",
      time: "2 days"
    },
    {
      title: "Delivery",
      description: "We deliver the cloth to your doorstep.",
      time: "3 days"
    },
    {
      title: "Feeback / Return",
      description: "We get feedback from you and accept returns if necessary.",
      time: "Anytime"
    }
  ];


  let timelines: ITimeLine[] = [];
  if (productType === "readyMadeCloth" || productType === "readyMadeShoe" || productType === "accessory") {
    timelines = readyMadeTimelines;
  } else {
    timelines = bespokeTimelines;
  }

  return (
    <View className="h-auto w-full mt-5">
      <Text className="font-semibold">3 Weeks</Text>
      <Text className="mt-1">Delivery timeline</Text>

      <View className="mt-5">
        { timelines.map((timeline, index) => (
          <View key={ index }>
            <View className="h-auto w-full flex-row items-center">
              <View className="h-[14px] w-[14px] mr-3 rounded-full bg-gold" />
              <View>
                <Text className="font-montserratMedium text-black">{ timeline.title }</Text>
                <Text className="text-xs">{ timeline.description }</Text>
              </View>
            </View>
            {index !== timelines.length - 1 && (
              <View className="h-[20px] w-[1.9px] ml-1.5 my-0.5 bg-[#717472]" />
            )}
          </View>
        )) }
      </View>
    </View>
  );
};

export default TimelineComponent;