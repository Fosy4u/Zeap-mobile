import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IRequiredMeasurementFormFieldsSchema, requiredMeasurementFormFieldsSchema } from "../validations/measurement_validation";
import { useAddBodyMeasurementTemplateMutation } from "../apis/measurement_api";
import { RootState } from "../../../../redux/store/store";
import { useSelector } from "react-redux";
import { IMeasurementField } from "../models/requiredMeasurementFormField_model";
import { useAddProductToCartMutation } from "../../products/apis/product_api";

const useMeasurementHook = () => {
    const { requiredMeasurementFormFields, saveMeasurementForNextTime } = useSelector((state: RootState) => state.measurementState);
    const { product, selectedQuantity, selectedColor } = useSelector((state: RootState) => state.productState);
    const [addProductToCart, { isLoading: addProductToCartLoading }] = useAddProductToCartMutation();
    const [addBodyMeasurementTemplate, { isLoading: addBodyMeasurementTemplateLoading }] = useAddBodyMeasurementTemplateMutation();
    
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<IRequiredMeasurementFormFieldsSchema>({
        defaultValues: {
            templateName: "",
            measurements: requiredMeasurementFormFields?.measurements?.map((measurement: IMeasurementField) => ({
                name: measurement?.name!,
                fields: measurement?.fields?.map(() => "")
            })) || [],
            instructions: ""
        },
        resolver: yupResolver(requiredMeasurementFormFieldsSchema)
    });

    const onSubmit: SubmitHandler<IRequiredMeasurementFormFieldsSchema> = async (data) => {
        console.log("PRODUCT", product.productId!);

            // Transform the measurements into the desired format.
            const measurements = data.measurements?.map((measurement: IMeasurementField, measurementIndex: number) => {
                const measurementData = measurement?.fields?.map((value, fieldIndex) => {
                    const fieldNames = requiredMeasurementFormFields.measurements?.[measurementIndex]?.fields || [];
                    return {
                        field: fieldNames[fieldIndex] || `Field ${fieldIndex + 1}`,
                        value: Number(value) || 0,
                        unit: "inch",
                    };
                });
                return {
                    name: measurement.name,
                    measurements: measurementData,
                };
            });

            // Create the save measurement template request data.
            const templateRequestData = {
                templateName: data.templateName,
                measurements: measurements,
            };
            console.log("TEMPLATE REQUEST DATA::: ", templateRequestData);
            

            // Create the add to cart request data.
            const cartRequestData = (product.productType === "readyMadeCloth" || product.productType === "readyMadeShoe" || product.productType === "accessory")
                ? ({
                    productId: product.productId,
                    quantity: selectedQuantity,
                    sku: product.variations?.[0].sku!,
                }) : ((product.productType === "bespokeCloth" || product.productType === "bespokeShoe") && (product.variations?.[0].sku === "BESPOKE")
                ? {
                    productId: product.productId,
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
            console.log("CART REQUEST DATA::: ", cartRequestData);

        try {
            const addProductToCartResponse = await addProductToCart(cartRequestData).unwrap();
            console.log("ADD PRODUCT TO CART RESPONSE::: ", addProductToCartResponse);

            if (addProductToCartResponse && saveMeasurementForNextTime) {
                const bodyMeasurementResponse = await addBodyMeasurementTemplate(templateRequestData).unwrap();
                console.log("BODY MEASUREMENT RESPONSE::: ", bodyMeasurementResponse);
            }
        } catch (error) {
            console.log("ERROR::: ", error);
        }
    };
    
    return {
        control, handleSubmit, onSubmit, errors, getValues,
        addProductToCartLoading,
        addBodyMeasurementTemplateLoading
    };
};

export default useMeasurementHook;