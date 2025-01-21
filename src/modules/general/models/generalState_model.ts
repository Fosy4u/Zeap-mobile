import { IAccessories, IClothes, IShoes } from "./productOptions_model";

interface IGeneralStateModel {
    readyMadeClothesOptions: IClothes;
    readyMadeShoesOptions: IShoes;
    bespokeClothesOptions: IClothes;
    bespokeShoesOptions: IShoes;
    accessoriesOptions: IAccessories;
};

export default IGeneralStateModel;