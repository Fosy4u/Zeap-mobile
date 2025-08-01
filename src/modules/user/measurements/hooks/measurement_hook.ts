import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IRequiredMeasurementFormFieldsSchema, requiredMeasurementFormFieldsSchema } from "../validations/measurement_validation";
import { useAddBodyMeasurementTemplateMutation, useLazyGetAllSavedMeasurementsQuery, useLazyGetBodyMeasurementGuideQuery, useLazyGetRequiredMeasurementFormFieldsQuery } from "../apis/measurement_api";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { IMeasurementField } from "../models/requiredMeasurementFormField_model";
import { useAddProductToCartMutation } from "../../products/apis/product_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { setAllSavedMeasurements, setBodyMeasurementGuides, setIsLoading, setLoadingMessage, setRequiredMeasurementFormFields, setSelectedCartID } from "../slices/measurement_slice";
import { IMeasurement } from "../models/bodyMeasurement_model";
import handleError from "../../../general/hooks/errorHandler_hook";

const useMeasurementHook = () => {
    const { selectedUnit, requiredMeasurementFormFields, saveMeasurementForNextTime, selectedMeasurementTemplate } = useSelector((state: RootState) => state.measurementState);
    const { product, selectedQuantity, selectedColor } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    
    const [addProductToCart] = useAddProductToCartMutation();
    const [addBodyMeasurementTemplate] = useAddBodyMeasurementTemplateMutation();
    const [getAllSavedMeasurements] = useLazyGetAllSavedMeasurementsQuery();
    const [getRequiredMeasurementFormFields, { isLoading: requiredMeasurementFormFieldsLoading }] = useLazyGetRequiredMeasurementFormFieldsQuery(); 
    const [getBodyMeasurementGuide] = useLazyGetBodyMeasurementGuideQuery();   
    
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<IRequiredMeasurementFormFieldsSchema>({
        defaultValues: {
            templateName: selectedMeasurementTemplate.templateName || "",
            measurements: requiredMeasurementFormFields?.measurements?.map((measurement: IMeasurementField) => ({
                name: measurement?.name!,
                fields: measurement?.fields?.map(() => "")
            })) || [],
            instructions: ""
        },
        resolver: yupResolver(requiredMeasurementFormFieldsSchema)
    });

    const onSubmitFromMeasurementForm: SubmitHandler<IRequiredMeasurementFormFieldsSchema> = async (data) => {

        // Transform the measurements into the desired format.
        const measurements = data.measurements?.map((measurement: IMeasurementField, measurementIndex: number) => {
            const measurementData = measurement?.fields?.map((value, fieldIndex) => {
                const fieldNames = requiredMeasurementFormFields.measurements?.[measurementIndex]?.fields || [];
                return {
                    field: (fieldNames[fieldIndex] || `Field ${fieldIndex + 1}`).toLowerCase(),
                    value: Number(value) || 0,
                };
            });
            return {
                name: measurement.name!,
                measurements: measurementData,
            };
        });
        // console.log("MEASUREMENTS DATA::: ", JSON.stringify(data));

        // Create the save measurement template request data.
        const templateRequestData = {
            templateName: data.templateName,
            measurements: measurements?.map((measurement) => {
                return {
                    name: measurement.name,
                    measurements: measurement.measurements?.map((measurementItem) => {
                        return {
                            field: measurementItem.field,
                            value: measurementItem.value,
                            unit: selectedUnit,
                        };
                    }),
                };
            }),
        };
        // console.log("TEMPLATE REQUEST DATA::: ", JSON.stringify(templateRequestData));
        

        // Create the add to cart request data.
        const cartRequestData = (product.productType === "readyMadeCloth" || product.productType === "readyMadeShoe" || product.productType === "accessory")
            ? ({
                productId: product.productId,
                quantity: selectedQuantity,
                sku: product.variations?.[0].sku!,
            }) : ((product.productType === "bespokeCloth" || product.productType === "bespokeShoe") && (product.variations?.[0].sku === "BESPOKE")
            ? {
                productId: product.productId,
                quantity: selectedQuantity,
                sku: "BESPOKE",
                bespokeColor: selectedColor.name,
                bespokeInstruction: data.instructions,
                bodyMeasurements: measurements,
            } : {
                productId: product.productId,
                quantity: selectedQuantity,
                sku: "BESPOKE-MULTIPLE",
                bespokeInstruction: data.instructions,
                bodyMeasurements: measurements,
            });
        console.log("CART REQUEST DATA::: ", JSON.stringify(cartRequestData));

        try {
            // First, add product to cart
            const addProductToCartResponse = await addProductToCart(cartRequestData).unwrap();
            console.log("ADD PRODUCT TO CART RESPONSE::: ", addProductToCartResponse);
    
            // If product was added successfully and user wants to save measurements
            // if (saveMeasurementForNextTime) {
            //     const bodyMeasurementResponse = await addBodyMeasurementTemplate(templateRequestData).unwrap();
            //     console.log("BODY MEASUREMENT RESPONSE::: ", bodyMeasurementResponse);
            // }
                    
            // Update cart ID and navigate only after all operations are complete
            dispatch(setSelectedCartID(addProductToCartResponse._id!));
            navigation.navigate("homeScreen", {
                screen: "Cart"
            });
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };


    // Handle Add Product To Cart from selectedMeasurementTemplate
    const onSubmitFromSavedMeasurementTemplate = async () => {
        dispatch(setLoadingMessage("Adding product to cart..."));
        dispatch(setIsLoading(true));

        const cartRequestData = (product.productType === "readyMadeCloth" || product.productType === "readyMadeShoe" || product.productType === "accessory")
            ? ({
                productId: product.productId,
                quantity: selectedQuantity,
                sku: product.variations?.[0].sku!,
            }) : ((product.productType === "bespokeCloth" || product.productType === "bespokeShoe") && (product.variations?.[0].sku === "BESPOKE")
                ? {
                    productId: product.productId,
                    quantity: selectedQuantity,
                    sku: "BESPOKE",
                    bespokeColor: selectedColor.name,
                    bespokeInstruction: "",
                    bodyMeasurements: selectedMeasurementTemplate.measurements!,
                } : {
                    productId: product.productId,
                    quantity: selectedQuantity,
                    sku: "BESPOKE-MULTIPLE",
                    bespokeInstruction: "",
                    bodyMeasurements: selectedMeasurementTemplate.measurements!.map((measurement: IMeasurement) => {
                        return {
                            name: measurement.name,
                            measurements: measurement.measurements!,
                        };
                    }),
                }
            );
        console.log("CART REQUEST DATA::: ", cartRequestData);
    
        try {
            const addProductToCartResponse = await addProductToCart(cartRequestData).unwrap();
            console.log("ADD PRODUCT TO CART RESPONSE::: ", addProductToCartResponse);
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get all saved measurements
    const handleGetAllSavedMeasurements = async () => {
        dispatch(setLoadingMessage("Fetching saved measurements..."));
        dispatch(setIsLoading(true));

        try {
            const allSavedMeasurementsResponse = await getAllSavedMeasurements().unwrap();
            console.log("ALL SAVED MEASUREMENTS RESPONSE::: ", allSavedMeasurementsResponse);
            
            if (allSavedMeasurementsResponse) {
                dispatch(setAllSavedMeasurements(allSavedMeasurementsResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get required measurement form fields
    const handleGetRequiredMeasurementFormFields = async () => {
        dispatch(setLoadingMessage("Fetching required measurement form fields..."));
        dispatch(setIsLoading(true));

        try {
            const requiredMeasurementFormFieldsResponse = await getRequiredMeasurementFormFields(product?.productId!).unwrap();
            console.log("REQUIRED MEASUREMENT FORM FIELDS RESPONSE::: ", requiredMeasurementFormFieldsResponse);
            
            if (requiredMeasurementFormFieldsResponse) {
                dispatch(setRequiredMeasurementFormFields(requiredMeasurementFormFieldsResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Handle get body measurement guide
    const handleGetBodyMeasurementGuides = async (gender: string) => {
        dispatch(setLoadingMessage("Fetching body measurement guide..."));
        dispatch(setIsLoading(true));

        try {
            const bodyMeasurementGuideResponse = await getBodyMeasurementGuide(gender).unwrap();
            console.log("BODY MEASUREMENT GUIDE RESPONSE::: ", bodyMeasurementGuideResponse);
            
            if (bodyMeasurementGuideResponse) {
                dispatch(setBodyMeasurementGuides(bodyMeasurementGuideResponse));
            }
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };
    
    return {
        control, handleSubmit, errors, getValues,
        onSubmitFromMeasurementForm, 
        onSubmitFromSavedMeasurementTemplate,

        handleGetAllSavedMeasurements,
        handleGetRequiredMeasurementFormFields,
        handleGetBodyMeasurementGuides,

        requiredMeasurementFormFieldsLoading,
    };
};

export default useMeasurementHook;