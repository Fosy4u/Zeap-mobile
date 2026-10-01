import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Setting4 } from 'iconsax-react-native';
import IVendorProductDetails, { IVariation } from '../models/vendorProductDetails_model';
import HTMLView from 'react-native-htmlview';
import FormatWords from '../../../../utils/formatWords';
import useVariationManagerHook from '../hooks/variationManager_hook';
import ManageVariationsModal from '../modals/manageVariations_modal';
import useDisplayCurrency from '../../../general/hooks/displayCurrency_hook';

interface IProps {
  product: IVendorProductDetails;
}

/* Turn a raw category value (string or string[]) into a readable, capitalised
   label. Dashes act as word separators on the backend (e.g. "ready-made"). */
const formatValue = (value?: string | string[]): string => {
  if (!value || (Array.isArray(value) && value.length === 0)) return "";
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .filter(Boolean)
    .map((part) => FormatWords.capitalizeWords(part.split("-").join(" ")))
    .join(", ");
};

/* A single label / value row, matching the existing key-value layout. */
const DetailRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <View className="h-auto w-full mt-3 flex-row items-start justify-between">
      <Text className="text-gray-600">{ label }:</Text>
      <Text className="w-[60%] font-medium text-right">{ value }</Text>
    </View>
  );
};

const VendorProductDescriptionComponent: React.FC<IProps> = ({ product }) => {
  const categories = product?.categories;
  const { formatPrice } = useDisplayCurrency();

  // Variations open in the full-screen "Manage Variations" modal. Shown only for
  // ready-to-wear products (bespoke uses a different model); available in any
  // status, since a live product still needs price/stock updates.
  const { canManageVariations } = useVariationManagerHook();
  const [showManageModal, setShowManageModal] = useState(false);

  /* Bespoke products carry a single variation whose colours live under the
     bespoke node; ready-to-wear products carry one variation per colour/size. */
  const variations: IVariation[] = product?.variations ?? [];
  const bespoke = variations?.[0]?.bespoke;
  const isBespoke = !!bespoke?.isBespoke;

  /* Category rows, in the same order as the web product page. Empty fields are
     dropped by DetailRow so drafts don't show a wall of blank rows. */
  const categoryRows: { label: string; value?: string }[] = [
    { label: "Product ID", value: product?.productId },
    { label: "Type", value: formatValue(categories?.type) },
    { label: "Accessory Type", value: formatValue(categories?.accessoryType) },
    { label: "Main", value: formatValue(categories?.main) },
    { label: "Style", value: formatValue(categories?.style) },
    { label: "Design", value: formatValue(categories?.design) },
    { label: "Occasion", value: formatValue(categories?.occasion) },
    { label: "Fit", value: formatValue(categories?.fit) },
    { label: "Gender", value: formatValue(categories?.gender) },
    { label: "Sleeve Length", value: formatValue(categories?.sleeveLength) },
    { label: "Fastening", value: formatValue(categories?.fastening) },
    { label: "Product Group", value: formatValue(categories?.productGroup) },
    { label: "Brand", value: formatValue(categories?.brand) },
    { label: "Age Group", value: formatValue(categories?.age?.ageGroup) },
    { label: "Age Range", value: categories?.age?.ageRange },
  ].filter((row) => !!row.value);

  return (
    <View className="mt-4">
      <HTMLView
        value={product?.description || "<p>No description available</p>"}
        stylesheet={{
          p: { color: "#374151", fontSize: 12 }, // text-gray-700, text-xs
          h1: { fontSize: 14, fontWeight: "bold" },
          a: { color: "#10B981", textDecorationLine: "underline" }, // green-500
        }}
      />

      <View className="mt-1">
        <View className="h-auto w-full flex-row items-start justify-between">
          <Text className="text-gray-600">Product name:</Text>
          <Text className="w-[60%] font-medium text-right">{ product?.title! }</Text>
        </View>

        <DetailRow label="Fabric" value="None" />
        <DetailRow label="Color" value={ formatValue(product?.colors?.map((color) => color.value!)) } />
      </View>

      {/*==== Categories (Product ID etc.) ====*/}
      { categoryRows.length > 0 && (
        <View className="mt-6">
          <Text className="font-montserratSemiBold text-[15px] text-gray-700">Categories</Text>
          <View className="mt-1">
            { categoryRows.map((row) => (
              <DetailRow key={ row.label } label={ row.label } value={ row.value } />
            )) }
          </View>
        </View>
      ) }

      {/*==== Variations ====*/}
      { (variations.length > 0 || canManageVariations) && (
        <View className="mt-6">
          {/* Title row — "Manage Variations" opens the full-screen manager. */}
          <View className="flex-row items-center justify-between">
            <Text className="font-montserratSemiBold text-[15px] text-gray-700">
              Variation{ variations.length > 1 ? "s" : "" }
            </Text>
            { canManageVariations && (
              <TouchableOpacity
                onPress={ () => setShowManageModal(true) }
                className="flex-row items-center gap-x-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
              >
                <Setting4 size={ 16 } color="#133522" />
                <Text className="font-montserratMedium text-xs text-baseGreen">Manage Variations</Text>
              </TouchableOpacity>
            ) }
          </View>

          {/* Read-only cards here; add / edit / delete live in the manager. */}
          <View className="mt-2 gap-y-3">
            { variations.map((variation, index) => (
              <View
                key={ variation._id ?? variation.sku ?? index }
                className="h-auto w-full p-3 border border-gray-200 rounded-xl bg-lightGray"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-montserratMedium text-xs text-gray-500">SKU</Text>
                  <Text className="font-montserratSemiBold text-sm text-gray-700">{ variation.sku ?? "-" }</Text>
                </View>

                {/* Bespoke keeps its colours under the bespoke node; ready-to-wear
                    uses the flat colorValue on each variation. */}
                <DetailRow
                  label="Color"
                  value={
                    isBespoke
                      ? formatValue(bespoke?.availableColors)
                      : formatValue(variation.colorValue)
                  }
                />
                <DetailRow label="Size" value={ formatValue(variation.size) } />
                <DetailRow
                  label="Price"
                  value={ variation.price != null ? formatPrice(variation.price, variation.currency) : undefined }
                />
                <DetailRow
                  label="Quantity"
                  value={ variation.quantity != null ? `${variation.quantity}` : undefined }
                />
              </View>
            )) }
          </View>
        </View>
      ) }

      {/*==== Manage Variations (full-screen) ====*/}
      <ManageVariationsModal
        visible={ showManageModal }
        onClose={ () => setShowManageModal(false) }
      />
    </View>
  )
}

export default VendorProductDescriptionComponent;
