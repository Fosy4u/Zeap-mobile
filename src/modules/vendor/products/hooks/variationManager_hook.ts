import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store/store";
import { IVariation } from "../models/vendorProductDetails_model";
import { IColorEnum } from "../../../general/models/productOptions_model";
import {
    useAddProductVariationMutation,
    useDeleteProductVariationMutation,
    useUpdateProductVariationMutation,
} from "../apis/readyMadeProduct_api";
import { useLazyGetProductByProductIDQuery } from "../apis/product_api";
import { setLoadingMessage, setProduct, setProductIsLoading } from "../slices/vendorProductState_slice";
import { stepFiveAddBespokeShoesSchema, stepFiveAddReadyMadeClothesSchema } from "../validations/addProduct_validation";
import handleError from "../../../general/hooks/errorHandler_hook";

export interface IColorOption {
    colorName: string;
    colorCode: string;
}
export interface IVariationCombo {
    colorName: string;
    colorCode: string;
    size: string;
}
export interface IVariationInput {
    colorValue: string;
    size: string;
    price: number;
    quantity: number;
    sku?: string;
}
export interface IBespokeVariationInput {
    price: number;
    colorType: string;
    availableColors: string[];
}

const BESPOKE_SKU = "BESPOKE";

const READY_TO_WEAR = ["readyMadeCloth", "readyMadeShoe", "accessory"];

const isBespokeType = (productType?: string): boolean =>
    !!productType && productType.toLowerCase().startsWith("bespoke");

const useVariationManagerHook = () => {
    const { product, productIsLoading } = useSelector((state: RootState) => state.vendorProductState);
    const { readyMadeClothesOptions, readyMadeShoesOptions, accessoriesOptions, bespokeClothesOptions, bespokeShoesOptions } =
        useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();

    const [addProductVariation] = useAddProductVariationMutation();
    const [updateProductVariation] = useUpdateProductVariationMutation();
    const [deleteProductVariation] = useDeleteProductVariationMutation();
    const [getProductByProductID] = useLazyGetProductByProductIDQuery();

    const variations: IVariation[] = product?.variations ?? [];
    const isReadyToWear = READY_TO_WEAR.includes(product?.productType ?? "");
    const isBespoke = isBespokeType(product?.productType);
    const canManageVariations = isReadyToWear || isBespoke;

    // Colour enums for this product type — used to resolve each colour's hex.
    const colorEnumsForType: IColorEnum[] = useMemo(() => {
        switch (product?.productType) {
            case "readyMadeCloth": return readyMadeClothesOptions.colorEnums ?? [];
            case "readyMadeShoe": return readyMadeShoesOptions.colorEnums ?? [];
            case "accessory": return accessoriesOptions.colorEnums ?? [];
            case "bespokeCloth": return bespokeClothesOptions.colorEnums ?? [];
            case "bespokeShoe": return bespokeShoesOptions.colorEnums ?? [];
            default: return [];
        }
    }, [product?.productType, readyMadeClothesOptions, readyMadeShoesOptions, accessoriesOptions, bespokeClothesOptions, bespokeShoesOptions]);

    // The product's uploaded colours (name + resolved hex) and sizes.
    const colorOptions: IColorOption[] = useMemo(
        () => (product?.colors ?? []).map((color) => ({
            colorName: color.value ?? "",
            colorCode: colorEnumsForType.find((enumColor) => enumColor.name === color.value)?.hex ?? "#e5e7eb",
        })),
        [product?.colors, colorEnumsForType],
    );
    const sizes: string[] = product?.sizes ?? [];

    // Bespoke colours are the ones the vendor can source on request, so the
    // picker offers the full enum for the product type rather than only the
    // colours already uploaded against the product.
    const bespokeColorOptions: IColorOption[] = useMemo(
        () => colorEnumsForType.map((enumColor) => ({
            colorName: enumColor.name ?? "",
            colorCode: enumColor.hex ?? "#e5e7eb",
        })),
        [colorEnumsForType],
    );

    // colour+size combinations that don't yet have a variation — the pool the
    // "Add Variation" quick picker offers.
    const availableCombos: IVariationCombo[] = useMemo(() => {
        const taken = new Set(variations.map((variation) => `${variation.colorValue}|${variation.size}`));
        const combos: IVariationCombo[] = [];
        colorOptions.forEach((color) => {
            sizes.forEach((size) => {
                if (!taken.has(`${color.colorName}|${size}`)) {
                    combos.push({ colorName: color.colorName, colorCode: color.colorCode, size });
                }
            });
        });
        return combos;
    }, [variations, colorOptions, sizes]);

    // Base SKU (everything before the trailing "-<size>-<colour>") lifted from an
    // existing variation, so the picker can preview SKUs the backend will mint.
    const skuBase = useMemo(() => {
        const sample = variations.find((variation) => variation.sku && variation.size && variation.colorValue);
        if (!sample) return "";
        return sample.sku!.replace(new RegExp(`-${sample.size}-${sample.colorValue}$`), "");
    }, [variations]);

    const previewSku = (size: string, colorName: string) =>
        skuBase ? `${skuBase}-${size}-${colorName}` : `${size}-${colorName}`;

    // Refetch the product and push it back into Redux so every screen reflects
    // the change.
    const refreshProduct = async (productId: string) => {
        const updatedProduct = await getProductByProductID(productId).unwrap();
        if (updatedProduct) dispatch(setProduct(updatedProduct));
    };

    // Edit a single existing variation (identified by its sku).
    const handleUpdateVariation = async (input: IVariationInput): Promise<boolean> => {
        const productId = product?.productId || "";
        dispatch(setLoadingMessage("Updating product variation..."));
        dispatch(setProductIsLoading(true));
        try {
            const requestData = await stepFiveAddReadyMadeClothesSchema.validate({
                productId,
                variation: {
                    colorValue: input.colorValue,
                    size: input.size,
                    price: Number(input.price),
                    quantity: Number(input.quantity),
                    sku: input.sku,
                },
                currentStep: 5,
            });
            const response = await updateProductVariation(requestData).unwrap();
            if (response) await refreshProduct(productId);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Add one or more new variations (the quick picker passes the selected set).
    const handleAddVariations = async (inputs: IVariationInput[]): Promise<boolean> => {
        const productId = product?.productId || "";
        dispatch(setLoadingMessage(inputs.length > 1 ? "Adding product variations..." : "Adding product variation..."));
        dispatch(setProductIsLoading(true));
        try {
            for (const input of inputs) {
                const requestData = await stepFiveAddReadyMadeClothesSchema.validate({
                    productId,
                    variation: {
                        colorValue: input.colorValue,
                        size: input.size,
                        price: Number(input.price),
                        quantity: Number(input.quantity),
                    },
                    currentStep: 5,
                });
                await addProductVariation(requestData).unwrap();
            }
            await refreshProduct(productId);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Bespoke products carry exactly one variation: price plus the colour setup.
    // Adds it on first save, edits it afterwards, mirroring the create flow.
    const handleSaveBespokeVariation = async (input: IBespokeVariationInput): Promise<boolean> => {
        const productId = product?.productId || "";
        const existingSku = variations[0]?.sku ?? BESPOKE_SKU;
        const isFirstSave = variations.length === 0;

        dispatch(setLoadingMessage(isFirstSave ? "Adding product variation..." : "Updating product variation..."));
        dispatch(setProductIsLoading(true));
        try {
            const requestData = await stepFiveAddBespokeShoesSchema.validate({
                productId,
                variation: {
                    colorType: input.colorType,
                    availableColors: input.availableColors,
                    price: Number(input.price),
                    ...(isFirstSave ? {} : { sku: existingSku }),
                },
                currentStep: 5,
            });
            const response = isFirstSave
                ? await addProductVariation(requestData).unwrap()
                : await updateProductVariation(requestData).unwrap();
            if (response) await refreshProduct(productId);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    // Delete an existing variation by sku.
    const handleDeleteVariation = async (sku?: string): Promise<boolean> => {
        const productId = product?.productId || "";
        dispatch(setLoadingMessage("Deleting product variation..."));
        dispatch(setProductIsLoading(true));
        try {
            const response = await deleteProductVariation({ productId, sku, currentStep: 5 }).unwrap();
            if (response) await refreshProduct(productId);
            return true;
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            dispatch(setProductIsLoading(false));
            dispatch(setLoadingMessage(""));
        }
    };

    return {
        productIsLoading,
        canManageVariations,
        isBespoke,
        colorOptions,
        bespokeColorOptions,
        sizes,
        availableCombos,
        previewSku,
        handleUpdateVariation,
        handleAddVariations,
        handleSaveBespokeVariation,
        handleDeleteVariation,
    };
};

export default useVariationManagerHook;
