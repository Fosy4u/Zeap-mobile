import React from 'react';
import { processColor, StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

const NAMED_COLOR_HEXES: Record<string, string> = {
    milk: "#F7F3EA",
    cream: "#FFFDD0",
    offwhite: "#FAF9F6",
    champagne: "#F7E7CE",
    nude: "#E3BC9A",
    peach: "#FFE5B4",
    camel: "#C19A6B",
    taupe: "#483C32",
    mustard: "#E1AD01",
    rust: "#B7410E",
    terracotta: "#E2725B",
    wine: "#722F37",
    burgundy: "#800020",
    charcoal: "#36454F",
    ash: "#B2BEB5",
    lilac: "#C8A2C8",
    mint: "#98FF98",
    emerald: "#50C878",
    sky: "#87CEEB",
};

const MULTICOLOR_VALUES = [
    "multicolor", "multicolour", "multi", "mixed", "mixedcolor", "mixedcolour", "assorted", "various",
    "bespoke", "custom",
];

// Strip spaces/dashes so "Multi-Color" and "multi color" both match.
const normalize = (value?: string): string => (value ?? "").toLowerCase().replace(/[^a-z]/g, "");

const isMulticolor = (value?: string): boolean => MULTICOLOR_VALUES.includes(normalize(value));

const resolveBackground = (hex?: string, value?: string): string => {
    if (hex) { return hex; }

    const mapped = NAMED_COLOR_HEXES[normalize(value)];
    if (mapped) { return mapped; }

    const name = (value ?? "").trim().toLowerCase();
    if (name && processColor(name) != null) { return name; }

    return "#d1d5db";
};

const MULTICOLOR_HUES = [
    "#EF4444", // red
    "#F97316", // orange
    "#FACC15", // yellow
    "#22C55E", // green
    "#2563EB", // blue
    "#8B5CF6", // violet
];

/* One pie wedge of the swatch. Angles run clockwise from 12 o'clock, so the
   first hue sits top-centre where the eye lands first. */
const wedgePath = (radius: number, startAngle: number, endAngle: number): string => {
    const point = (angle: number) => {
        const radians = ((angle - 90) * Math.PI) / 180;
        return `${ radius + radius * Math.cos(radians) } ${ radius + radius * Math.sin(radians) }`;
    };
    return `M ${ radius } ${ radius } L ${ point(startAngle) } A ${ radius } ${ radius } 0 0 1 ${ point(endAngle) } Z`;
};

interface IProps {
    value?: string;
    hex?: string;
    size?: number;
    borderColor?: string;
    borderWidth?: number;
    style?: StyleProp<ViewStyle>;
}

const ColorSwatchComponent: React.FC<IProps> = ({
    value,
    hex,
    size = 12,
    /* gray-300 rather than gray-200: pale fills like Milk or White sit on an
       almost-white card, so the ring is what makes them read as a swatch. */
    borderColor = "#d1d5db",
    borderWidth = 1,
    style,
}) => {
    if (isMulticolor(value)) {
        const inner = size - borderWidth * 2;
        const radius = inner / 2;
        const sweep = 360 / MULTICOLOR_HUES.length;

        return (
            <View
                style={[
                    { height: size, width: size, borderRadius: size / 2, borderWidth, borderColor, overflow: "hidden" },
                    style,
                ]}
            >
                <Svg width={ inner } height={ inner }>
                    <G>
                        <Circle cx={ radius } cy={ radius } r={ radius } fill={ MULTICOLOR_HUES[0] } />
                        { MULTICOLOR_HUES.map((hue, index) => (
                            <Path
                                key={ hue }
                                d={ wedgePath(radius, index * sweep, (index + 1) * sweep) }
                                fill={ hue }
                            />
                        )) }
                    </G>
                </Svg>
            </View>
        );
    }

    const backgroundColor = resolveBackground(hex, value);

    return (
        <View
            style={[
                { height: size, width: size, borderRadius: size / 2, borderWidth, borderColor, backgroundColor },
                style,
            ]}
        />
    );
};

export { isMulticolor };
export default ColorSwatchComponent;
