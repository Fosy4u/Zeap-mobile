import IBodyMeasurement from "./bodyMeasurement_model";
import IBodyMeasurementGuide from "../../../general/models/bodyMeasurementGuide_model";
import IRequiredMeasurementFormFields from "./requiredMeasurementFormField_model";

interface IMeasurementState {
    selectedCartID: string,
    saveMeasurementForNextTime: boolean,
    showAddNewMeasurementBottomSheet: boolean,
    showSelectGenderBottomSheet: boolean,
    selectedUnit: string,
    unitOptions: IUnitOption[],
    allSavedMeasurements: IBodyMeasurement[];
    selectedMeasurementTemplate: IBodyMeasurement;
    requiredMeasurementFormFields: IRequiredMeasurementFormFields;
    bodyMeasurementGuides: IBodyMeasurementGuide[]
    selectedGender: string;
    loadingMessage: string;
    isLoading: boolean;
};

interface IUnitOption {
    key: string;
    value: string;
}

export default IMeasurementState;