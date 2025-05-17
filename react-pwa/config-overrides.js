const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  // Fix ESM module resolution issues
  addWebpackModuleRule({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false
    }
  })
);
