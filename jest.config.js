module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.(bmp|gif|jpg|jpeg|mp4|mov|png|psd|svg|webp|ttf|otf)$': require.resolve('react-native/jest/assetFileTransformer.js'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-native-firebase|@react-native-google-signin|@react-native-clipboard|@react-native-camera-roll|@react-navigation|@reduxjs/toolkit|immer|react-redux|redux|reselect|@stripe|@gorhom|iconsax-react-native|nativewind|react-native-.*|@hookform|yup|country-state-city)/)',
  ],
};
