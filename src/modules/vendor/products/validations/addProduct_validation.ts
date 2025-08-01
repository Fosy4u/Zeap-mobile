import * as yup from "yup";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Step 1 Schemas
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const stepOneAddProductSchema = yup.object().shape({
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Step 2 Schemas
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const stepTwoAddClothesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    categories: yup.object().shape({
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
    }),
    currentStep: yup.number().required("Current step is required."),
});

const stepTwoAddShoesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    categories: yup.object().shape({
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
        heelHeight: yup.string().required("Heel height is required."),
        heelType: yup.string().required("Heel type is required."),
        fastening: yup.array().of(yup.string()).min(1, "Fastening is required."),
    }),
    currentStep: yup.number().required("Current step is required."),
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Step 3 Schemas
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const stepThreeAddBespokeClothesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    measurements: yup.array().of(yup.object().shape({
        name: yup.string().required("Measurement name is required."),
        fields: yup.array().of(yup.string()).min(1, "Field is required."),
    })).min(1, "At least one measurement is required."),
});
const stepThreeAddReadyMadeClothesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    sizes: yup.array().of(yup.string()).min(1, "Size is required."),
    currentStep: yup.number().required("Current step is required."),
});

const stepThreeAddBespokeShoesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    measurements: yup.array().of(yup.object().shape({
        name: yup.string().required("Measurement name is required."),
        fields: yup.array().of(yup.string()).min(1, "Field is required."),
    })).min(1, "At least one measurement is required."),
    currentStep: yup.number().required("Current step is required."),
});
const stepThreeAddReadyMadeShoesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    sizes: yup.array().of(yup.string()).min(1, "Size is required."),
    currentStep: yup.number().required("Current step is required."),
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Step 5 Schemas
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const stepFiveAddBespokeShoesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    variation: yup.object().shape({
        colourType: yup.string().required("Color type is required."),
        availableColors: yup.array().of(yup.string()).min(1, "Color is required."),
        price: yup.number().required("Price is required."),
    }),
    currentStep: yup.number().required("Current step is required."),
});
const stepFiveAddReadyMadeClothesSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required."),
    variation: yup.object().shape({
        colorValue: yup.string().required("Color value is required."),
        size: yup.string().required("Size is required."),
        price: yup.number().required("Price is required."),
        quantity: yup.number().required("Quantity is required."),
        sku: yup.string().optional(),
    }),
    currentStep: yup.number().required("Current step is required."),
});


export type IStepOneAddProduct = yup.InferType<typeof stepOneAddProductSchema>

export type IStepTwoAddClothes = yup.InferType<typeof stepTwoAddClothesSchema>
export type IStepTwoAddShoes = yup.InferType<typeof stepTwoAddShoesSchema>

export type IStepThreeAddBespokeClothes = yup.InferType<typeof stepThreeAddBespokeClothesSchema>
export type IStepThreeAddReadyMadeClothes = yup.InferType<typeof stepThreeAddReadyMadeClothesSchema>
export type IStepThreeAddBespokeShoes = yup.InferType<typeof stepThreeAddBespokeShoesSchema>
export type IStepThreeAddReadyMadeShoes = yup.InferType<typeof stepThreeAddReadyMadeShoesSchema>

export type IStepFiveAddBespokeShoes = yup.InferType<typeof stepFiveAddBespokeShoesSchema>
export type IStepFiveAddReadyMadeClothes = yup.InferType<typeof stepFiveAddReadyMadeClothesSchema>


export {
    stepOneAddProductSchema,

    stepTwoAddClothesSchema,
    stepTwoAddShoesSchema,

    stepThreeAddBespokeClothesSchema,
    stepThreeAddReadyMadeClothesSchema,
    stepThreeAddBespokeShoesSchema,
    stepThreeAddReadyMadeShoesSchema,

    stepFiveAddBespokeShoesSchema,
    stepFiveAddReadyMadeClothesSchema,
};
