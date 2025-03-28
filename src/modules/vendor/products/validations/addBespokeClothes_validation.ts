import * as yup from "yup";

const stepOneAddBespokeClothesSchema = yup.object().shape({
    title: yup
        .string()
        .required("Title is required."),
    subTitle: yup
        .string()
        .required("Subtitle is required."),
    description: yup
        .string()
        .required("Description is required."),
    productType: yup
        .string()
        .required("Product type is required."),
    shopId: yup
        .string()
        .required("Shop ID is required."),
});

const stepTwoAddBespokeClothesSchema = yup.object().shape({
    main: yup.array().of(yup.string()).min(1, "Main category is required."),
    style: yup.array().of(yup.string()).min(1, "Style is required."),
    gender: yup.array().of(yup.string()).min(1, "Gender is required."),
    age: yup.object().shape({
        ageGroup: yup.string().required("Age group is required."),
        ageRange: yup.string().when('ageGroup', {
          is: (ageGroup: string) => ageGroup === 'Kids',
          then: (schema) => schema.required("Age range is required for Kids."),
          otherwise: (schema) => schema.optional(),
        }),
      }),
    brand: yup.string().required("Brand is required."),
    design: yup.array().of(yup.string()).min(1, "Design is required."),
    occasion: yup.array().of(yup.string()).min(1, "Occasion is required."),
    sleeveLength: yup.string().required("Sleeve length is required."),
    fastening: yup.array().of(yup.string()).min(1, "Fastening is required."),
    fit: yup.array().of(yup.string()).min(1, "Fit is required."),
    
});

const stepThreeAddBespokeClothesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    measurements: yup.array().of(yup.object().shape({
        name: yup.string().required("Measurement name is required."),
        fields: yup.array().of(yup.string()).min(1, "Field is required."),
    })).min(1, "At least one measurement is required."),
});

export type IStepOneAddBespokeClothes = yup.InferType<typeof stepOneAddBespokeClothesSchema>
export type IStepTwoAddBespokeClothes = yup.InferType<typeof stepTwoAddBespokeClothesSchema>
export type IStepThreeAddBespokeClothes = yup.InferType<typeof stepThreeAddBespokeClothesSchema>

export {
    stepOneAddBespokeClothesSchema,
    stepTwoAddBespokeClothesSchema,
    stepThreeAddBespokeClothesSchema,
};