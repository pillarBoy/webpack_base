var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var htmlWebpack = require('./htmlWebpack');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
});

var plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),
  // new ExtractTextPlugin({
  //   filename: utils.assetsPath('css/[name].[contenthash].css')
  // }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrorsPlugin(),
  // 全局引入
  new webpack.ProvidePlugin({
    $: 'jquery',
    jquery: 'jquery',
    'window.jquery': 'jquery',
    'window.$': 'jquery'
  })
];

plugins = [...plugins, ...htmlWebpack(config.pagesList, config.dev.env)];

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      extract: false // 是否需要单独分离样式 css文件
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: plugins
});
