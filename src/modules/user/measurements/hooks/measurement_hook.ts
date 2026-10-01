import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IRequiredMeasurementFormFieldsSchema, requiredMeasurementFormFieldsSchema } from "../validations/measurement_validation";
import { useAddBodyMeasurementTemplateMutation, useDeleteBodyMeasurementTemplateMutation, useLazyGetAllSavedMeasurementsQuery, useLazyGetRequiredMeasurementFormFieldsQuery } from "../apis/measurement_api";
import { useLazyGetBodyMeasurementGuideQuery } from "../../../general/apis/general_api";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { IMeasurementField } from "../models/requiredMeasurementFormField_model";
import { useAddProductToCartMutation } from "../../products/apis/product_api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RootNavigationStackModel from "../../../../routes/model/routes_model";
import { setAllSavedMeasurements, setBodyMeasurementGuides, setIsLoading, setLoadingMessage, setRequiredMeasurementFormFields, setSaveMeasurementForNextTime, setSelectedCartID, setSelectedGender, setSelectedMeasurementTemplate, setShowAddNewMeasurementBottomSheet } from "../slices/measurement_slice";
import handleError from "../../../general/hooks/errorHandler_hook";
import IBodyMeasurement from "../models/bodyMeasurement_model";

const useMeasurementHook = () => {
    const { requiredMeasurementFormFields, saveMeasurementForNextTime, selectedMeasurementTemplate, selectedGender } = useSelector((state: RootState) => state.measurementState);
    const { product, selectedQuantity, selectedColor } = useSelector((state: RootState) => state.productState);
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();
    
    const [addProductToCart] = useAddProductToCartMutation();
    const [addBodyMeasurementTemplate] = useAddBodyMeasurementTemplateMutation();
    const [deleteBodyMeasurementTemplate] = useDeleteBodyMeasurementTemplateMutation();
    const [getAllSavedMeasurements] = useLazyGetAllSavedMeasurementsQuery();
    const [getRequiredMeasurementFormFields, { isLoading: requiredMeasurementFormFieldsLoading }] = useLazyGetRequiredMeasurementFormFieldsQuery(); 
    const [getBodyMeasurementGuide] = useLazyGetBodyMeasurementGuideQuery();   
    
    const findSavedFieldValue = (categoryName: string | undefined, fieldName: string): string => {
        const tpl = selectedMeasurementTemplate?.measurements as any[] | undefined;
        if (!tpl || tpl.length === 0) return "";
        const first: any = tpl[0];
        const isFlat = first?.field !== undefined && first?.measurements === undefined;
        const target = fieldName.toLowerCase();
        const pool: any[] = isFlat
            ? tpl
            : (tpl.find((g: any) => (g?.name ?? "").toLowerCase() === (categoryName ?? "").toLowerCase())?.measurements
                ?? tpl.flatMap((g: any) => g?.measurements ?? []));
        const match = pool.find((m: any) => (m?.field ?? "").toLowerCase() === target);
        return match?.value !== undefined && match?.value !== null ? String(match.value) : "";
    };

    const { control, handleSubmit, formState: { errors }, getValues } = useForm<IRequiredMeasurementFormFieldsSchema>({
        defaultValues: {
            templateName: selectedMeasurementTemplate.templateName || "",
            measurements: requiredMeasurementFormFields?.measurements?.map((measurement: IMeasurementField) => ({
                fields: measurement?.fields?.map((fieldName) => findSavedFieldValue(measurement?.name, fieldName))
            })) || [],
            instructions: ""
        },
        resolver: yupResolver(requiredMeasurementFormFieldsSchema)
    });

    const onSubmitFromMeasurementForm: SubmitHandler<IRequiredMeasurementFormFieldsSchema> = async (data) => {
        dispatch(setLoadingMessage(saveMeasurementForNextTime ? "Saving measurement template..." : "Adding product to cart..."));
        dispatch(setIsLoading(true));

        const measurements = data.measurements?.map((measurement, measurementIndex: number) => {
            const apiMeasurement = requiredMeasurementFormFields.measurements?.[measurementIndex];
            const fieldNames = apiMeasurement?.fields || [];
            const measurementData = measurement?.fields?.map((value, fieldIndex) => ({
                field: fieldNames[fieldIndex] || `Field ${fieldIndex + 1}`,
                value: Number(value) || 0,
            }));
            return {
                // Group name comes from the API source, not form state.
                name: apiMeasurement?.name ?? "",
                measurements: measurementData,
            };
        });

        const flatTemplateMeasurements = measurements?.flatMap((group) => group.measurements ?? []) ?? [];

        const normalizedGender = selectedGender
            ? selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1).toLowerCase()
            : selectedGender;

        const templateRequestData = {
            templateName: (data.templateName ?? "").trim(),
            gender: normalizedGender,
            measurements: flatTemplateMeasurements,
        };

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

        try {
            if (saveMeasurementForNextTime) {
                await addBodyMeasurementTemplate(templateRequestData).unwrap();
            }

            dispatch(setLoadingMessage("Adding product to cart..."));
            const addProductToCartResponse = await addProductToCart(cartRequestData).unwrap();

            dispatch(setSelectedCartID(addProductToCartResponse._id!));
            dispatch(setShowAddNewMeasurementBottomSheet(false));
            navigation.navigate("homeScreen", {
                screen: "Cart"
            });
        } catch (error) {
            handleError(error);
        } finally {
            dispatch(setIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };


    // Handle "Use This Measurement" for a selected saved template.
    const handleUseSavedMeasurement = async () => {
        dispatch(setLoadingMessage("Loading measurement form..."));
        dispatch(setIsLoading(true));

        dispatch(setSaveMeasurementForNextTime(false));

        const tplGender = (selectedMeasurementTemplate as any)?.gender as string | undefined;
        if (tplGender) {
            dispatch(setSelectedGender(tplGender.toLowerCase()));
        }

        try {
            const tasks: Promise<any>[] = [];
            if (requiredMeasurementFormFields?.productId !== product?.productId) {
                tasks.push(handleGetRequiredMeasurementFormFields());
            }
            if (tplGender) {
                tasks.push(handleGetBodyMeasurementGuides(tplGender.toLowerCase()));
            }
            if (tasks.length > 0) {
                await Promise.all(tasks);
            }

            dispatch(setShowAddNewMeasurementBottomSheet(true));
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

    // Handle edit measurement template
    const handleEditMeasurementTemplate = async (template: IBodyMeasurement) => {
        dispatch(setSelectedMeasurementTemplate(template));
        const tplGender = (template as any)?.gender as string | undefined;
        if (tplGender) {
            dispatch(setSelectedGender(tplGender.toLowerCase()));
            await handleGetBodyMeasurementGuides(tplGender.toLowerCase());
        }
        navigation.navigate("editMeasurementTemplateScreen");
    };

    // Handle get body measurement guide
    const handleGetBodyMeasurementGuides = async (gender: string) => {
        dispatch(setLoadingMessage("Fetching body measurement guide..."));
        dispatch(setIsLoading(true));

        try {
            const bodyMeasurementGuideResponse = await getBodyMeasurementGuide(gender).unwrap();
            
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
    
    // Delete a saved measurement template by id. Callers (the measurement
    const handleDeleteMeasurementTemplate = async (templateId: string): Promise<boolean> => {
        if (!templateId) return false;
        try {
            await deleteBodyMeasurementTemplate({ template_id: templateId }).unwrap();
            if (selectedMeasurementTemplate?._id === templateId) {
                dispatch(setSelectedMeasurementTemplate({} as IBodyMeasurement));
            }
            await handleGetAllSavedMeasurements();
            return true;
        } catch (error) {
            console.log("DELETE TEMPLATE ERROR (raw):", JSON.stringify(error, null, 2));
            handleError(error);
            return false;
        }
    };

    return {
        control, handleSubmit, errors, getValues,
        onSubmitFromMeasurementForm,
        handleUseSavedMeasurement,

        handleGetAllSavedMeasurements,
        handleGetRequiredMeasurementFormFields,
        handleGetBodyMeasurementGuides,
        handleEditMeasurementTemplate,
        handleDeleteMeasurementTemplate,

        requiredMeasurementFormFieldsLoading,
    };
};

export default useMeasurementHook;