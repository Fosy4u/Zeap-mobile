import { IAccessories, IClothes, IShoes } from "./productOptions_model";

interface IGeneralStateModel {
    productTypes: string[];
    readyMadeClothesOptions: IClothes;
    readyMadeShoesOptions: IShoes;
    bespokeClothesOptions: IClothes;
    bespokeShoesOptions: IShoes;
    accessoriesOptions: IAccessories;

    isLoading: boolean;
    loadingMessage: string;
};

export default IGeneralStateModel;