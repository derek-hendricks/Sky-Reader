const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: [
    './popup/src/scripts/index.js'
  ],
  output: {
    filename: 'popup.js',
    path: path.join(__dirname, '../', 'build'),
    publicPath: '/'
  },


  resolve: {
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({ //<--key to reduce React's size
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
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
