
const normalize = (value?: string): string => (value ?? "").toLowerCase().replace(/[^a-z]/g, "");

const PLACEHOLDER_COLOR_VALUES = ["bespoke", "custom"];

const unique = (values: string[]): string[] => values.filter((value, index, all) => all.indexOf(value) === index);

interface IColorLike { value?: string };
interface IVariationLike { bespoke?: { availableColors?: any[] } };

const getProductSwatchValues = (product?: {
    colors?: IColorLike[];
    variations?: IVariationLike[];
}): string[] => {
    const bespokeColors = unique(
        (product?.variations ?? [])
            .flatMap((variation) => variation?.bespoke?.availableColors ?? [])
            .filter((color): color is string => typeof color === "string" && !!color.trim()),
    );

    const values = unique(
        (product?.colors ?? [])
            .map((color) => color?.value)
            .filter((value): value is string => !!value?.trim()),
    );

    return unique(
        values.flatMap((value) =>
            PLACEHOLDER_COLOR_VALUES.includes(normalize(value))
                ? (bespokeColors.length > 0 ? bespokeColors : [value])
                : [value],
        ),
    );
};

export default getProductSwatchValues;
