import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import AppHeaderComp from '../../../vendor/general/components/appHeader_comp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store/store'
import { setSelectedTab } from '../slices/reviewAndRating_slice'
import PendingReviewsComponent from '../components/pendingReviews_component'
import GivenReviewsComponent from '../components/givenReviews_component'
import AppLoader from '../../../general/components/appLoader'
import useReviewAndRatingHook from '../hooks/reviewAndRating_hook'

const ReviewAndRatingScreen = () => {
    const { tabs, selectedTab, isLoading, loadingMessage } = useSelector((state: RootState) => state.reviewAndRatingState);
    const dispatch = useDispatch();

    const { handleGetAllReviews } = useReviewAndRatingHook();

    React.useEffect(() => {
        handleGetAllReviews();
    }, []);

    return (
        <GestureHandlerRootView>
            <BottomSheetModalProvider>
                <SafeAreaView className="h-full w-full flex-1 bg-white">
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="dark-content"
                    />

                    {/*==== Header ====*/}
                    <AppHeaderComp title="Review & Rating" />

                    {/*==== Tab View ====*/}
                    <View className="h-auto w-full flex-1 mt-8 px-5">
                        <View className="h-auto w-full flex-row justify-between">
                            { tabs.map((tab, index) => (
                                <TouchableOpacity key={ index }
                                    onPress={ () => dispatch(setSelectedTab(tab)) }
                                    className={`h-auto pb-1 flex-1 justify-center`}
                                >
                                    <Text className={`text-center font-montserratMedium ${(selectedTab === tab) ? "text-gray-700 text-[15px]" : "text-gray-500"}`}>{ tab }</Text>
                                    <View className={`mt-1 ${(selectedTab === tab) ? "h-1.5 bg-gold rounded-full" : "h-[1px] bg-gray-200"}`} />
                                </TouchableOpacity>
                            )) }
                        </View>

                        { (selectedTab === "Pending Reviews") ? (
                            <PendingReviewsComponent />
                        ) : (
                            <GivenReviewsComponent />
                        ) }
                    </View>

                    {(isLoading) && <AppLoader loadingAdditionalMessage={loadingMessage} />}
                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default ReviewAndRatingScreen