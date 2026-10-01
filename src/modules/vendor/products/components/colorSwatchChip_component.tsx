import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface IProps {
  colorName: string;
  colorCode: string;
  /* Border/ring classes for the chip body, so callers keep control of the
     selected state. Defaults to the plain unselected border. */
  className?: string;
}

const MULTICOLOR_STOPS = ["#F9A8D4", "#C084FC", "#60A5FA", "#4ADE80", "#FACC15"];

const isFlatHex = (hex?: string) => !!hex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());

const isMulticolor = (colorName?: string, colorCode?: string) =>
  /multi[\s-]?colou?r/i.test(colorName ?? "") || !isFlatHex(colorCode);

const getReadableTextColor = (hex: string) => {
  if (!isFlatHex(hex)) return "text-black";

  let value = hex.trim().slice(1);
  /* Expand the #RGB shorthand to #RRGGBB before measuring. */
  if (value.length === 3) {
    value = value.split("").map((char) => char + char).join("");
  }

  const brightness =
    parseInt(value.slice(0, 2), 16) * 0.299 +
    parseInt(value.slice(2, 4), 16) * 0.587 +
    parseInt(value.slice(4, 6), 16) * 0.114;

  return brightness > 200 ? "text-black" : "text-white";
};

const ColorSwatchChipComponent: React.FC<IProps> = ({ colorName, colorCode, className = "border border-gray-300" }) => {
  const chipClassName = `h-auto w-16 py-2.5 rounded-lg ${className}`;

  if (isMulticolor(colorName, colorCode)) {
    return (
      <LinearGradient
        colors={ MULTICOLOR_STOPS }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={ chipClassName }
        style={{ borderRadius: 8 }}
      >
        <Text className="text-xs text-center text-black">{ colorName }</Text>
      </LinearGradient>
    );
  }

  return (
    <View className={ chipClassName } style={{ backgroundColor: colorCode }}>
      <Text className={ `text-xs text-center ${getReadableTextColor(colorCode)}` }>{ colorName }</Text>
    </View>
  );
};

export { isMulticolor, isFlatHex, getReadableTextColor, MULTICOLOR_STOPS };
export default ColorSwatchChipComponent;
