const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure for GitHub Pages deployment
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure asset paths for GitHub Pages deployment
config.transformer = {
  ...config.transformer,
  publicPath: '/qr-io/',
};

module.exports = config;
