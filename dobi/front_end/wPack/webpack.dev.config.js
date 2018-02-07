var webpack = require('webpack');
var merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var config = require('../config');
var baseWebpackConfig = require('./webpack.base.config.js');
var plugins = require('./plugins.js');
var env = config.env.dev;

var devPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  })
]
// 压缩
if (config.devUglify) {
  devPlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: [ '$super', '$', 'exports', 'require', 'module', '_' ]
      },
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    })
  )
}
// 图像显示打包情况
if (env.BundleAnalyzer) {
  // 图形化打包
  proPlugins.push( new BundleAnalyzerPlugin() );
}


plugins = [...plugins, ...devPlugins];

module.exports = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: plugins
})
