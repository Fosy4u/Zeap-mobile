import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootNavigationStackModel from '../../../../routes/model/routes_model';
import IProduct from '../../products/models/product_model';
import { setProductID } from '../../products/slices/product_slice';
import { useGetProductByProductIDQuery } from '../../products/apis/product_api';
import ProductCardComponent from '../../../general/components/productCard_component';

interface IProps {
    product: IProduct;
}

const SavedProductCard: React.FC<IProps> = ({ product }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootNavigationStackModel>>();
    const dispatch = useDispatch();

    const { data: liveProduct } = useGetProductByProductIDQuery(product?.productId, { skip: !product?.productId });
    const displayProduct = (liveProduct as unknown as IProduct) ?? product;

    return (
        <ProductCardComponent
            product={ displayProduct }
            orientation="Vertical"
            gridItem
            handleOnPress={ () => {
                dispatch(setProductID(product.productId));
                navigation.navigate("productDetailScreen");
            } }
        />
    );
};

export default SavedProductCard;
