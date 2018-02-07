var webpack = require('webpack');
var merge = require('webpack-merge');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var baseWebpackConfig = require('./webpack.base.config.js');
var config = require('../config');
var plugins = require('./plugins.js');
var env = config.env.build

// 清空 原来js文件
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
fse.remove(path.join(__dirname, '..', '/../public/js'), function(err) {
  if (err) return console.error('清除public/js文件夹失败');
});
fse.remove(path.join(__dirname, '..', '/../public/css'), function(err) {
  if (err) return console.error('清除public/js文件夹失败');
});

var proPlugins = [
  // 配置环境变量  语言变量
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
      LANG: "cn"
    }
  })
]

// 压缩
if (config.proUglify) {
  proPlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: [ '$super', '$', 'exports', 'require', 'module', '_' ]
      },
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    })
  );
  proPlugins.push(  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }));
}
// 图像显示打包情况
if (env.BundleAnalyzer) {
  // 图形化打包
  proPlugins.push( new BundleAnalyzerPlugin() );
}

plugins = [...plugins, ...proPlugins];

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: []
  },
  devtool: '#cheap-module-source-map',
  // devtool: '#source-map',
  plugins: plugins
})
