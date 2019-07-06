const path = require('path');
const webpack = require('webpack');

/*
new HtmlWebpackPlugin({
      title: 'Production',
      minify: true
    })
      devtool: "eval-source-map",
 */
module.exports = {
  mode: 'production',
  entry: [
    './event/src/index.js'
  ],
  output: {
    filename: 'event.js',
    path: path.join(__dirname, '../', 'build')
  },

  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({ //<--key to reduce React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),


  ],

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
