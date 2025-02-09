/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['nativewind/babel'],
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        baseGreen: '#133522',
        lightGreen: '#D5F4E3',
        lightGold: '#FFFAF2',
        gold: '#D5B07B',
        lightOrange: '#fefce8',
        orange: '#ddb31d',
        black: '#151518',
        lightGray: '#F3F4F6',
      },
      fontFamily: {
        // montserrat: {
        //   light: "Montserrat-Light",
        //   regular: "Montserrat-Regular",
        //   medium: "Montserrat-Medium",
        //   semibold: "Montserrat-SemiBold",
        //   bold: "Montserrat-Bold",
        // },
        montserratLight: ['Montserrat-Light', 'serif'],
        montserratRegular: ['Montserrat-Regular', 'serif'],
        montserratNormal: ['Montserrat-Normal', 'serif'],
        montserratMedium: ['Montserrat-Medium', 'serif'],
        montserratSemiBold: ['Montserrat-SemiBold', 'serif'],
        montserratBold: ['Montserrat-Bold', 'serif'],
      },
    },
  },
  plugins: [],
};

// "Montserrat-Light", "Montserrat-Regular", "Montserrat-Medium", "Montserrat-SemiBold", "Montserrat-Bold"
