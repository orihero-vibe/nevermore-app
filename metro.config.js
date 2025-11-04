const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add Skia support
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-skia': '@shopify/react-native-skia',
};

module.exports = config;
