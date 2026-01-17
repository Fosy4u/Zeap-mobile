import IBodyMeasurement from "./bodyMeasurement_model";
import IBodyMeasurementGuide from "./bodyMeasurementGuide_model";
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
    loadingMessage: string;
    isLoading: boolean;
};

interface IUnitOption {
    key: string;
    value: string;
}

export default IMeasurementState;