import IBodyMeasurement from "./bodyMeasurement_model";
import IRequiredMeasurementFormFields from "./requiredMeasurementFormField_model";

interface IMeasurementState {
    saveMeasurementForNextTime: boolean,
    showSavedMeasurementBottomSheet: boolean,
    selectedUnit: string,
    unitOptions: IUnitOption[],
    allBodyMeasurementTemplates: IBodyMeasurement[];
    requiredMeasurementFormFields: IRequiredMeasurementFormFields;
};

interface IUnitOption {
    key: string;
    value: string;
}

export default IMeasurementState;