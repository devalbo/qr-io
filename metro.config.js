const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure for GitHub Pages deployment
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Set public path for GitHub Pages
config.server = {
  ...config.server,
  publicPath: '/qr-io/',
};

// Configure asset paths for web
config.transformer = {
  ...config.transformer,
  publicPath: '/qr-io/',
};

module.exports = config;
