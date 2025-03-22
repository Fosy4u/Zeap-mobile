import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IRequiredMeasurementFormFieldsSchema, requiredMeasurementFormFieldsSchema } from "../validations/measurement_validation";
import { useAddBodyMeasurementTemplateMutation, useLazyGetAllBodyMeasurementTemplatesQuery, useLazyGetRequiredMeasurementFormFieldsQuery } from "../apis/measurement_api";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { IMeasurementField } from "../models/requiredMeasurementFormField_model";
import { useAddProductToCartMutation } from "../../products/apis/product_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { setAllBodyMeasurementTemplates, setRequiredMeasurementFormFields, setSelectedCartID } from "../slices/measurement_slice";
import { IMeasurement } from "../models/bodyMeasurement_model";

const useMeasurementHook = () => {
    const { selectedUnit, requiredMeasurementFormFields, saveMeasurementForNextTime, selectedMeasurementTemplate } = useSelector((state: RootState) => state.measurementState);
    const { product, selectedQuantity, selectedColor } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    
    const [addProductToCart, {  isSuccess: addProductToCartSuccess, isLoading: addProductToCartLoading }] = useAddProductToCartMutation();
    const [addBodyMeasurementTemplate, { isLoading: addBodyMeasurementTemplateLoading }] = useAddBodyMeasurementTemplateMutation();
    const [getAllBodyMeasurementTemplates, { isLoading: allBodyMeasurementTemplatesLoading }] = useLazyGetAllBodyMeasurementTemplatesQuery();
    const [getRequiredMeasurementFormFields, { isLoading: requiredMeasurementFormFieldsLoading }] = useLazyGetRequiredMeasurementFormFieldsQuery();    
    
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
            console.log("Mutation triggered, isLoading should be true:", addProductToCartLoading);
            const addProductToCartResponse = await addProductToCart(cartRequestData).unwrap();
            console.log("Mutation completed, isLoading should be false:", addProductToCartLoading);
            console.log("ADD PRODUCT TO CART RESPONSE::: ", addProductToCartResponse);
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };

    // Get all Measurement related data
    const handleGetAllMeasurementsRelatedData = async() => {
        // console.log("PRODUCT ID::: ", product?.productId!);
        
        // Get All Existing Body Measurement Templates
        const allBodyMeasurementTemplatesResponse = await getAllBodyMeasurementTemplates().unwrap();
        dispatch(setAllBodyMeasurementTemplates(allBodyMeasurementTemplatesResponse));        

        // Get Required Measurement Form Fields
        const requiredMeasurementFormFieldsResponse = await getRequiredMeasurementFormFields(product?.productId!).unwrap();
        dispatch(setRequiredMeasurementFormFields(requiredMeasurementFormFieldsResponse));
        // console.log("REQUIRED MEASUREMENT FORM FIELDS RESPONSE::: ", requiredMeasurementFormFieldsResponse)
    };
    
    return {
        control, handleSubmit, errors, getValues,
        onSubmitFromMeasurementForm, 
        onSubmitFromSavedMeasurementTemplate,
        addProductToCartLoading,
        addBodyMeasurementTemplateLoading,
        requiredMeasurementFormFieldsLoading, allBodyMeasurementTemplatesLoading, handleGetAllMeasurementsRelatedData,
    };
};

export default useMeasurementHook;