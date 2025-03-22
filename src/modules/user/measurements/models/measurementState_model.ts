import IBodyMeasurement from "./bodyMeasurement_model";
import IRequiredMeasurementFormFields from "./requiredMeasurementFormField_model";

interface IMeasurementState {
    selectedCartID: string,
    saveMeasurementForNextTime: boolean,
    showSavedMeasurementBottomSheet: boolean,
    selectedUnit: string,
    unitOptions: IUnitOption[],
    allBodyMeasurementTemplates: IBodyMeasurement[];
    selectedMeasurementTemplate: IBodyMeasurement;
    requiredMeasurementFormFields: IRequiredMeasurementFormFields;
};

interface IUnitOption {
    key: string;
    value: string;
}

export default IMeasurementState;