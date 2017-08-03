const path = require('path');
const BUILD_DIR = path.resolve(__dirname, '../public/javascripts');
const APP_DIR = path.resolve(__dirname, 'src');
const webpack = require('webpack');

const config = {
  devtool: 'cheap-module-source-map',
  entry: APP_DIR + '/app.js',
  output: {
    path: BUILD_DIR,
    filename: 'app.js',
    sourceMapFilename: 'app.map'
  },
  module : {
    loaders : [
      {
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('.env.dev')
    })
  ]
};

module.exports = config;
