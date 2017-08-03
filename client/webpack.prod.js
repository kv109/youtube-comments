const path = require('path');
const BUILD_DIR = path.resolve(__dirname, 'src/public');
const APP_DIR = path.resolve(__dirname, 'src');
const webpack = require('webpack');

const config = {
  devtool: 'cheap-module-source-map',
  entry: APP_DIR + '/popup.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle-popup.js',
    sourceMapFilename: 'bundle-popup.map'
  },
  module : {
    loaders : [
      {
        include : APP_DIR,
        loader : 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('.env.prod')
    }),
    new webpack.ProvidePlugin({ // TODO: extract common parts like this
      $: APP_DIR + "/jquery.js",
    })
  ]
};

module.exports = config;
