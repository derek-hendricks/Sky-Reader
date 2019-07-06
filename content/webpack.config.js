const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/*
optimization: {
      splitChunks: {
        chunks: 'all'
       }
  },
    devtool: "eval-source-map",
 */
/*
  mode: 'production',
 */
module.exports = {
  mode: 'production',
  entry: [
    './content/src/scripts/index.js'
  ],
  output: {
    filename: 'content.js',
    path: path.join(__dirname, '../', 'build'),
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({ 
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          compact: true
        }
      }
    ]
  }
};
