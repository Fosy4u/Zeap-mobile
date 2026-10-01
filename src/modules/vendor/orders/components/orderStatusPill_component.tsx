import React from 'react';
import { Text, View } from 'react-native';

/* Every pill shares one recipe — tint-50 background, -300 border, -700 text — so
   only the hue changes between statuses and they read as one family. */
const STATUS_PILLS: Record<string, string> = {
    "placed":             "bg-slate-50 border-slate-300",
    "confirmed":          "bg-blue-50 border-blue-300",
    "order confirmed":    "bg-blue-50 border-blue-300",
    "processing":         "bg-amber-50 border-amber-300",
    "quality check":      "bg-indigo-50 border-indigo-300",
    "ready":              "bg-purple-50 border-purple-300",
    "ready for delivery": "bg-purple-50 border-purple-300",
    "dispatched":         "bg-emerald-50 border-emerald-300",
    "delivered":          "bg-green-50 border-green-300",
    "cancelled":          "bg-red-50 border-red-300",
    "rejected":           "bg-red-50 border-red-300",
};

const STATUS_TEXT: Record<string, string> = {
    "placed":             "text-slate-700",
    "confirmed":          "text-blue-700",
    "order confirmed":    "text-blue-700",
    "processing":         "text-amber-700",
    "quality check":      "text-indigo-700",
    "ready":              "text-purple-700",
    "ready for delivery": "text-purple-700",
    "dispatched":         "text-emerald-700",
    "delivered":          "text-green-700",
    "cancelled":          "text-red-700",
    "rejected":           "text-red-700",
};

/* A status the backend adds later still renders as a proper outlined pill rather
   than an odd grey box — only the hue falls back. */
const FALLBACK_PILL = "bg-slate-50 border-slate-300";
const FALLBACK_TEXT = "text-slate-700";

interface IProps {
    // The API's status.name, e.g. "quality check". Lowercase, sometimes absent.
    statusName?: string;
}

const OrderStatusPillComponent: React.FC<IProps> = ({ statusName }) => {
    const raw = statusName?.trim() ?? "";
    const key = raw.toLowerCase();
    const label = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : "Unknown";

    return (
        <View className={ `px-2.5 py-1.5 border rounded-lg ${ STATUS_PILLS[key] ?? FALLBACK_PILL }` }>
            <Text className={ `font-montserratMedium text-xs ${ STATUS_TEXT[key] ?? FALLBACK_TEXT }` }>
                { label }
            </Text>
        </View>
    );
};

export default OrderStatusPillComponent;
