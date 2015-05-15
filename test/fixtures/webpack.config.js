var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: __dirname,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
    libraryTarget: 'umd'
  },
  debug: true,
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap!less?sourceMap')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap')
      },
      {
        test: /\.mustache$/,
        loader: 'mustache-loader?noShortcut'
      },
      {
        test: /\.(svg|eot|ttf|woff|png|jpg|gif)$/,
        loader: 'url?limit=5000'
      }
    ]
  },
  entry: {
    'bar': './bar.js',
    'foo': './foo.js'
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin(1, '[name].bundle.css', {
      disabled: false,
      allChunks: true
    }),
    new CommonsChunkPlugin({
      name: "common",
      children: true,
      minChunks: Infinity
    })
  ]
};
