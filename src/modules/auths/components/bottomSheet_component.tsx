import { UnknownAction } from '@reduxjs/toolkit';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StatusBar, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface IProps {
    closeBottomSheet: (value: boolean) => UnknownAction;
};

const BottomSheetComponent: React.FC<IProps> = ({ closeBottomSheet }) => {
    const dispatch = useDispatch();
    const { height: SCREEN_HEIGHT } = Dimensions.get("window");
    const slideValue = new Animated.Value(SCREEN_HEIGHT / 0.7);
    const slideValueRef = useRef(slideValue).current;

    // Slide Animation function
    const slideUp = (): void => {
        Animated.timing(slideValueRef, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
        }).start();
    };
    const slideDown = (): void => {
        Animated.timing(slideValueRef, {
            toValue: 300,
            duration: 3000,
            useNativeDriver: false,
        }).start();
    };

    const handleCloseBottomSheet = () => {
        slideDown();
        
        setTimeout(() => {
            dispatch(closeBottomSheet(false));
        }, 100);
        slideDown();
    };

    useEffect(() => {
      slideUp();
    }, [slideValueRef]);
    

    return (
        <TouchableOpacity onPress={ () => handleCloseBottomSheet() } className="h-full w-full absolute inset-0 flex-1 justify-end bg-black/50">
            <StatusBar
                backgroundColor="gray"
                barStyle="dark-content"
            />

            <Animated.View
                className="h-[70%] w-full rounded-tl-[30px] rounded-tr-[30px] bg-white"
                style={{ transform: [{ translateY: slideValueRef }] }}
            >
                <View className="h-1 w-16 mx-auto mt-4 rounded-lg bg-gray-400" />


            </Animated.View>
        </TouchableOpacity>
        
    )
}

export default BottomSheetComponent;