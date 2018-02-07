var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const config = require('../config');

let commenPlugins = [
  new FriendlyErrorsPlugin(),
  // 全局引入
  new webpack.ProvidePlugin({
    $: 'jquery',
    jquery: 'jquery',
    'window.jquery': 'jquery',
    'window.$': 'jquery'
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // 配置 公共模块
  new webpack.optimize.CommonsChunkPlugin({
    name: ['commons', 'vendors'], // 将公共模块提取，生成名为`vendors`的chunk
    chunks: config.entry, // 提取哪些模块共有的部分
    minChunks: 5 // 提取至少5个模块共有的部分
  }),

  // 提取 manifest
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: 'Infinity'
  }),
  new ExtractTextPlugin({filename: `css/[name].[chunkhash:16].css`}),
  new AssetsPlugin({filename: path.resolve(__dirname, '../../public/version.json')})
]

//  多页模板
if (false && Array.isArray(config.entry)) {
  config.entry.forEach((pageName) => {
    commenPlugins.push(
      new htmlWebpackPlugin({
        // filename: 'html-withimg-loader!' + path.resolve(`./src/views/`, `${pageName}.html`), // 生成的html存放路径，相对于path
        filename: `./${pageName}.html`,
        template: path.join(__dirname, '..', `src/views/${pageName}.html`),
        inject: true, // js插入的位置，true/'head'/'body'/false
        chunks: ['vendors', pageName], // 需要引入的chunk，不配置就会引入所有页面的资源
      })
    )
  })
}
module.exports = commenPlugins;
