import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import AppHeaderComp from "../../general/components/appHeader_comp";
import {ArrowLeft, ArrowRight} from "iconsax-react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model.ts";
import StepOneComponent from '../components/addReadyMadeClothes/stepOne_component.tsx';
import { RootState } from '../../../../redux/store/store.ts';
import useAddReadyMadeClothesHook from '../hooks/readyMadeClothes/addReadyMadeClothes_hook.ts';
import useStepOneHook from '../hooks/readyMadeClothes/stepOne_hook.ts';
import { setSelectedStep } from '../slices/vendorProductState_slice.ts';
import useStepTwoHook from '../hooks/readyMadeClothes/stepTwo_hook.ts';
import StepTwoComponent from '../components/addReadyMadeClothes/stepTwo_component.tsx';
import AppLoader from '../../../general/components/appLoader.tsx';
import StepThreeComponent from '../components/addReadyMadeClothes/stepThree_component.tsx';
import StepFourComponent from '../components/addReadyMadeClothes/stepFour_component.tsx';
import StepFiveComponent from '../components/addReadyMadeClothes/stepFive_component.tsx';
import StepSixComponent from '../components/addReadyMadeClothes/stepSix_component.tsx';
import useStepThreeHook from '../hooks/readyMadeClothes/stepThree_hook.ts';
import useStepFourHook from '../hooks/readyMadeClothes/stepFour_hook.ts';
import DefaultProductImagePopupModal from '../modals/defaultProductImagePopup_modal.tsx';
import useStepFiveHook from '../hooks/readyMadeClothes/stepFive_hook.ts';
import useStepSixHook from '../hooks/readyMadeClothes/stepSix_hook.ts';
import PriceAdjustmentModal from '../modals/priceAdjustment_modal.tsx';
import WarningPopupModal from '../modals/warningPopup_modal.tsx';
import SuccessPopupModal from '../modals/successPopup_modal.tsx';
import UploadColorImageModal from '../modals/uploadColorImage_modal.tsx';
import AppStatusBar from "../../../general/components/appStatusBar";

const AddReadyMadeClothesScreen = () => {
    const { selectedStep , productIsLoading, loadingMessage, product } = useSelector((state: RootState) => state.vendorProductState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const {
        showWarningModal, setShowWarningModal,
        showSuccessModal, setShowSuccessModal,
        handleGetTextColor,
    } = useAddReadyMadeClothesHook();

    const {
        control, handleSubmit, errors, onSubmit, 
    } = useStepOneHook();

    const {
        manageState, handleSubmit: stepTwoHandleSubmit,
    } = useStepTwoHook();

    const {
        sizeStandardOptions, selectedSizeStandard, handleSelectSizeStandard,
        clotheSizes, selectedSizes, setSelectedSizes,
        showSizesDropDown, setShowSizesDropDown, handleSubmit: stepThreeHandleSubmit,
     } = useStepThreeHook();

     const {
        colorOptions, handleSelectColour, selectedColor: stepFourSelectedColor,
        selectedImages, uploadedColorAndImages, handleAddImage, handleRemoveImage, handleDeleteColor, handleDeleteUploadedImage,
        handleUploadColorAndImages, handleProceedToNextStep,
        showImageUploadModal, handleCloseImageUploadModal, handleAddMoreImages,
        setSelectedDefaultImage, showDefaultImageModal, setShowDefaultImageModal, handleSetDefaultImage,
     } = useStepFourHook();

    const {
        uploadedColorOptions, selectedColor: stepFiveSelectedColor, setSelectedColor,
        uploadedSizes, selectedSize, setSelectedSize,
        price, setPrice,
        quantity, setQuantity,
        setSelectedVariation,
        buttonActionType, setButtonActionType,
        handleAddProductVariation, handleUpdateProductVariation, handleDeleteProductVariation,
    } = useStepFiveHook();

    const {
        autoPricePercentage, setAutoPricePercentage, handleSaveAutoPricePercentage, handleDeactivateAutoPriceAdjustment,
        isAutoPriceAdjustment, setIsAutoPriceAdjustment,
        showPriceAdjustmentModal, setShowPriceAdjustmentModal,
        priceAdjustmentModalType, setPriceAdjustmentModalType,
        handleSubmitProduct,
    } = useStepSixHook(setShowWarningModal, setShowSuccessModal);
     

    const handleSaveAndContinue = () => {

        if (selectedStep === 1) {
            handleSubmit(async(data) => {
                await onSubmit(data);
            })();
        }

        if (selectedStep === 2) {
            stepTwoHandleSubmit();
        }

        if (selectedStep === 3) {
            stepThreeHandleSubmit();
        }

        if (selectedStep === 4) {
            // Per-colour uploads happen via the in-card "Upload" button; here we
            // just advance once at least one colour has been uploaded.
            handleProceedToNextStep();
        }

        if (selectedStep === 5) {
            dispatch(setSelectedStep(6));
        }
    };
        
    const handleGoBack = () => {
        (selectedStep >= 1) && dispatch(setSelectedStep(selectedStep - 1));
    };

    return (
        <SafeAreaView className="h-full w-full flex-1 bg-white">
            <AppStatusBar backgroundColor="#133522" barStyle="light-content" />

            {/*==== Header ====*/}
            <AppHeaderComp title={`Add Ready to Wear\nClothes`} />

            {/*==== Step Indicators ====*/}
            <View className="h-auto w-full px-5 pt-4 pb-2 flex-row gap-x-2">
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 1 ? "border-baseGreen bg-gray-50" : selectedStep > 1 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 2 ? "border-baseGreen bg-gray-50" : selectedStep > 2 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 3 ? "border-baseGreen bg-gray-50" : selectedStep > 3 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 4 ? "border-baseGreen bg-gray-50" : selectedStep > 4 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 5 ? "border-baseGreen bg-gray-50" : selectedStep > 5 ? "border-baseGreen bg-baseGreen" : "border-gray-100 bg-gray-50"}`} />
                <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 6 ? "border-baseGreen bg-gray-50" : selectedStep > 6 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
            </View>

            <ScrollView showsVerticalScrollIndicator={ false } className="h-full w-full px-5">

                { selectedStep === 1 ? (
                    <StepOneComponent control={ control } errors={ errors } />
                ) : (selectedStep === 2) ? (
                    <StepTwoComponent manageState={ manageState } />
                ) : (selectedStep === 3) ? (
                    <StepThreeComponent
                        sizeStandardOptions={ sizeStandardOptions }
                        selectedSizeStandard={ selectedSizeStandard }
                        handleSelectSizeStandard={ handleSelectSizeStandard }
                        clotheSizes={ clotheSizes }
                        selectedSizes={ selectedSizes }
                        setSelectedSizes={ setSelectedSizes }
                        showSizesDropDown={ showSizesDropDown }
                        setShowSizesDropDown={ setShowSizesDropDown }
                    />
                ) : (selectedStep === 4) ? (
                    <StepFourComponent
                        colorOptions={ colorOptions }
                        selectedColor={ stepFourSelectedColor }
                        handleGetTextColor={ handleGetTextColor }
                        handleSelectColour={ handleSelectColour }
                        uploadedColorAndImages={ uploadedColorAndImages }
                        handleDeleteColor={ handleDeleteColor }
                        handleDeleteUploadedImage={ handleDeleteUploadedImage }
                        handleAddMoreImages={ handleAddMoreImages }
                        setSelectedDefaultImage={ setSelectedDefaultImage }
                        setShowDefaultImageModal={ setShowDefaultImageModal }
                    />
                ) : (selectedStep === 5) ? (
                    <StepFiveComponent propsData={{
                        uploadedColorOptions,
                        selectedColor: stepFiveSelectedColor,
                        setSelectedColor,
                        uploadedSizes, selectedSize, setSelectedSize,
                        price, setPrice,
                        quantity, setQuantity,
                        setSelectedVariation,
                        buttonActionType, setButtonActionType,
                        handleAddProductVariation,
                        handleUpdateProductVariation,
                        handleDeleteProductVariation,
                    }} />
                ) : (
                    <StepSixComponent
                        autoPricePercentage={ autoPricePercentage }
                        isAutoPriceAdjustment={ isAutoPriceAdjustment }
                        setIsAutoPriceAdjustment={ setIsAutoPriceAdjustment }
                        setShowPriceAdjustmentModal={ setShowPriceAdjustmentModal }
                        setPriceAdjustmentModalType={ setPriceAdjustmentModalType }
                    />
                ) }

                { selectedStep <= 5 ? (
                    <View className="h-auto w-full mt-8 flex-row">
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            disabled={ productIsLoading }
                            className={`h-[55px] w-[35%] flex-row items-center justify-center rounded-xl bg-red-50 ${ productIsLoading ? "opacity-50" : "" }`}
                        >
                            <Text className="font-montserratMedium text-base text-red-700">Cancel</Text>
                        </TouchableOpacity>
                        <View className="w-[20px]" />

                        <TouchableOpacity
                            onPress={ () => handleSaveAndContinue() }
                            disabled={ productIsLoading }
                            className={`h-[55px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen ${ productIsLoading ? "opacity-70" : "" }`}
                        >
                            { productIsLoading && selectedStep <= 4 ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Text className="mr-2 font-montserratRegular text-base text-white">Save & Continue</Text>
                                    <ArrowRight size={ 18 } className="text-white" />
                                </>
                            ) }
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={ () => setShowWarningModal(true) }
                        disabled={ productIsLoading }
                        className={`h-[55px] flex-1 mt-8 flex-row items-center justify-center rounded-xl bg-baseGreen ${ productIsLoading ? "opacity-70" : "" }`}
                    >
                        { productIsLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Text className="mr-2 font-montserratRegular text-base text-white">Submit</Text>
                                <ArrowRight size={ 18 } className="text-white" />
                            </>
                        ) }
                    </TouchableOpacity>
                ) }

                { selectedStep > 1 && (
                    <TouchableOpacity
                        onPress={ () => handleGoBack() }
                        disabled={ productIsLoading }
                        className={`h-[55px] w-full mt-5 flex-row items-center justify-center rounded-xl bg-lightGreen ${ productIsLoading ? "opacity-50" : "" }`}
                    >
                        <ArrowLeft size={ 18 } className="text-baseGreen" />
                        <Text className="ml-2 font-montserratMedium text-base text-baseGreen">Go Back</Text>
                    </TouchableOpacity>
                ) }

                <View className="h-10" />
            </ScrollView>

            { showPriceAdjustmentModal &&
                <PriceAdjustmentModal 
                    priceAdjustmentModalType={ priceAdjustmentModalType }
                    autoPricePercentage={ autoPricePercentage }
                    productIsLoading={ productIsLoading }
                    setAutoPricePercentage={ setAutoPricePercentage }
                    setShowPriceAdjustmentModal={ setShowPriceAdjustmentModal }
                    setIsAutoPriceAdjustment={ setIsAutoPriceAdjustment }
                    handleSaveAutoPricePercentage={ handleSaveAutoPricePercentage }
                    handleDeactivateAutoPriceAdjustment={ handleDeactivateAutoPriceAdjustment }
                />
            }

            { showWarningModal &&
                <WarningPopupModal 
                    screenURL="profileSetupScreen" 
                    setShowWarningModal={setShowWarningModal}
                    handleSubmitProduct={handleSubmitProduct}
                />
            }

            { showSuccessModal &&
                <SuccessPopupModal
                    setShowSuccessModal={ setShowSuccessModal }
                    productID={ product?.productId }
                />
            }

            { showDefaultImageModal &&
                <DefaultProductImagePopupModal
                    bodyText="Are you sure you want to use this as default image?"
                    setShowDefaultImageModal={ setShowDefaultImageModal }
                    handleSetDefaultImage={ handleSetDefaultImage }
                />
            }

            {/* Per-colour image upload modal — opens when a colour is selected. */}
            { showImageUploadModal && stepFourSelectedColor.length > 0 &&
                <UploadColorImageModal
                    colorName={ stepFourSelectedColor[0].colorName }
                    colorCode={ stepFourSelectedColor[0].colorCode }
                    selectedImages={ selectedImages }
                    handleAddImage={ handleAddImage }
                    handleRemoveImage={ handleRemoveImage }
                    handleUploadColorAndImages={ handleUploadColorAndImages }
                    isUploading={ productIsLoading }
                    onClose={ handleCloseImageUploadModal }
                />
            }

            { productIsLoading && selectedStep > 5 && !showPriceAdjustmentModal &&
                <AppLoader loadingAdditionalMessage={ loadingMessage } />
            }
        </SafeAreaView>
    )
}
export default AddReadyMadeClothesScreen;
