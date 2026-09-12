const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Expo's default getPolyfills can ask Node to resolve the non-exported
// `react-native/rn-get-polyfills` package subpath on some Node/macOS setups.
// Resolve the real file from React Native's exported package.json instead.
const reactNativeRoot = path.dirname(require.resolve('react-native/package.json'));
const reactNativePolyfills = path.join(reactNativeRoot, 'rn-get-polyfills.js');
config.serializer.getPolyfills = ({ platform }) =>
  platform ? require(reactNativePolyfills)() : [];

module.exports = config;
