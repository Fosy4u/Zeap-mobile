import * as yup from "yup";

const searchSchema = yup.object().shape({
    title: yup
        .string()
        .required("Search word is required."),
});

export type ISearchProduct = yup.InferType<typeof searchSchema>;
export default searchSchema;