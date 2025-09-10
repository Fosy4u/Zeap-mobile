import React from 'react'
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import { ArrowLeft, ArrowRight } from 'iconsax-react-native';
import StepOneComponent from '../components/addAccessories/stepOne_component';
import useStepOneHook from '../hooks/accessories/stepOne_hook';
import useAddAccessoriesHook from '../hooks/accessories/addAccessories_hook';
import StepTwoComponent from '../components/addAccessories/stepTwo_component';
import useStepTwoHook from '../hooks/accessories/stepTwo_hook';
import StepThreeComponent from '../components/addAccessories/stepThree_component';
import useStepThreeHook from '../hooks/accessories/stepThree_hook';
import useStepFourHook from '../hooks/accessories/stepFour_hook';
import StepFourComponent from '../components/addAccessories/stepFour_component';
import SuccessPopupModal from '../modals/successPopup_modal';
import DefaultProductImagePopupModal from '../modals/defaultProductImagePopup_modal';
import AppLoader from '../../../general/components/appLoader';
import { setSelectedStep } from '../slices/vendorProductState_slice';
import useStepFiveHook from '../hooks/accessories/stepFive_hook';
import StepFiveComponent from '../components/addAccessories/stepFive_component';
import useStepSixHook from '../hooks/accessories/stepSix_hook';
import StepSixComponent from '../components/addAccessories/stepSix_component';
import PriceAdjustmentModal from '../modals/priceAdjustment_modal';
import WarningPopupModal from '../modals/warningPopup_modal';

const AddAccessoriesScreen = () => {
  const { selectedStep , productIsLoading, loadingMessage } = useSelector((state: RootState) => state.vendorProductState);
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
  const dispatch = useDispatch();

  const {
    showWarningModal, setShowWarningModal,
    showSuccessModal, setShowSuccessModal,
    handleGetTextColor,
  } = useAddAccessoriesHook();

  const {
    control, handleSubmit, errors, onSubmit, 
  } = useStepOneHook();

  const {
    manageState, handleSubmit: stepTwoHandleSubmit,
  } = useStepTwoHook();

  const {
    accessorySizes, selectedSizes, setSelectedSizes, handleSubmit: stepThreeHandleSubmit, 
  } = useStepThreeHook();

  const {
    colorOptions, handleSelectColour, selectedColor: stepFourSelectedColor, setSelectedColor: stepFourSetSelectedColor,
    selectedImages, uploadedColorAndImages, handleAddImage, handleRemoveImage, handleDeleteColor, handleDeleteImage, handleUploadImage,
    setSelectedDefaultImage, showDefaultImageModal, setShowDefaultImageModal, handleSetDefaultImage,
  } = useStepFourHook();

  const {
      uploadedColorOptions, selectedColor: stepFiveSelectedColor, setSelectedColor: stepFiveSetSelectedColor,
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
        uploadedColorAndImages.length > 0 && dispatch(setSelectedStep(5));
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
      <StatusBar
          backgroundColor="#133522"
          barStyle="light-content"
      />

      {/*==== Header ====*/}
      <View className="h-auto w-full px-5 pt-4 pb-2 flex-row gap-x-2">
        <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 1 ? "border-baseGreen bg-gray-50" : selectedStep > 1 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
        <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 2 ? "border-baseGreen bg-gray-50" : selectedStep > 2 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
        <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 3 ? "border-baseGreen bg-gray-50" : selectedStep > 3 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
        <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 4 ? "border-baseGreen bg-gray-50" : selectedStep > 4 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
        <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 5 ? "border-baseGreen bg-gray-50" : selectedStep > 5 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
        <View className={`h-1 w-full flex-1 border rounded ${ selectedStep === 6 ? "border-baseGreen bg-gray-50" : selectedStep > 6 ? "border-baseGreen bg-baseGreen" : "border-gray-200 bg-gray-50"}`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={ false } className="h-full w-full px-5">

        { selectedStep === 1 ? (
          <StepOneComponent control={ control } errors={ errors } />
        ) : (selectedStep === 2) ? (
          <StepTwoComponent manageState={ manageState } />
        ) : (selectedStep === 3) ? (
          <StepThreeComponent
            accessorySizes={ accessorySizes }
            selectedSizes={ selectedSizes }
            setSelectedSizes={ setSelectedSizes }
          />
        ) : (selectedStep === 4) ? (
          <StepFourComponent
            colorOptions={ colorOptions }
            selectedColor={ stepFourSelectedColor }
            setSelectedColor={ stepFourSetSelectedColor }
            handleGetTextColor={ handleGetTextColor }
            handleSelectColour={ handleSelectColour }
            selectedImages={ selectedImages }
            uploadedColorAndImages={ uploadedColorAndImages }
            handleAddImage={ handleAddImage }
            handleRemoveImage={ handleRemoveImage }
            handleDeleteColor={ handleDeleteColor }
            handleDeleteImage={ handleDeleteImage }
            setSelectedDefaultImage={ setSelectedDefaultImage }
            setShowDefaultImageModal={ setShowDefaultImageModal }
            handleUploadImage={ handleUploadImage }
          />
        ) : (selectedStep === 5) ? (
          <StepFiveComponent propsData={{
            uploadedColorOptions,
            selectedColor: stepFiveSelectedColor,
            setSelectedColor: stepFiveSetSelectedColor,
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

        {/* ==== Cancel and Save & Continue ==== */}
        { selectedStep <= 5 ? (
            <View className="h-auto w-full mt-8 flex-row">
                <TouchableOpacity
                    onPress={ () => navigation.goBack() }
                    className="h-[55px] w-[35%] flex-row items-center justify-center rounded-xl bg-red-50"
                >
                    <Text className="font-montserratMedium text-base text-red-700">Cancel</Text>
                </TouchableOpacity>
                <View className="w-[20px]" />

                <TouchableOpacity
                    onPress={ () => handleSaveAndContinue() }
                    className="h-[55px] flex-1 flex-row items-center justify-center rounded-xl bg-baseGreen"
                >
                    <Text className="mr-2 font-montserratRegular text-base text-white">Save & Continue</Text>
                    <ArrowRight size={ 18 } className="text-white" />
                </TouchableOpacity>
            </View>
        ) : (
            <TouchableOpacity
                onPress={ () => {
                  setShowWarningModal(true)
                } }
                className="h-[55px] flex-1 mt-8 flex-row items-center justify-center rounded-xl bg-baseGreen"
            >
                <Text className="mr-2 font-montserratRegular text-base text-white">Submit</Text>
                <ArrowRight size={ 18 } className="text-white" />
            </TouchableOpacity>
        ) }
        
        { selectedStep > 1 && selectedStep <= 5 && (
            <TouchableOpacity
                onPress={ () => handleGoBack() }
                className="h-[55px] w-full mt-5 flex-row items-center justify-center rounded-xl bg-lightGreen"
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
                    setAutoPricePercentage={ setAutoPricePercentage }
                    setShowPriceAdjustmentModal={ setShowPriceAdjustmentModal }
                    setIsAutoPriceAdjustment={ setIsAutoPriceAdjustment }
                    handleSaveAutoPricePercentage={ handleSaveAutoPricePercentage }
                    handleDeactivateAutoPriceAdjustment={ handleDeactivateAutoPriceAdjustment }
                />
            }

            { showWarningModal &&
                <WarningPopupModal 
                  bodyText={"This will change the status of the product to \"under review\" and you will not be able to edit the product without contacting the admin." }
                  screenURL="profileSetupScreen" 
                  setShowWarningModal={setShowWarningModal}
                  handleSubmitProduct={handleSubmitProduct}
                />
            }

            { showSuccessModal &&
                <SuccessPopupModal
                    bodyText="You have successfully uploaded your item. It will be reviewed before it is listed for customers."
                    setShowSuccessModal={ setShowSuccessModal }
                />
            }

            { showDefaultImageModal &&
                <DefaultProductImagePopupModal
                    bodyText="Are you sure you want to use this as default image?"
                    setShowDefaultImageModal={ setShowDefaultImageModal }
                    handleSetDefaultImage={ handleSetDefaultImage }
                />
            }
            
            { productIsLoading && 
                <AppLoader loadingAdditionalMessage={ loadingMessage } />
            }
    </SafeAreaView>
  );
};

export default AddAccessoriesScreen