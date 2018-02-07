// 一个常见的`webpack`配置文件
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../config/index.js');
var gateway = require('./gateway.js');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: gateway.entry(config.entry),
  output: gateway.output(config.output),
  resolve: {
    // 引入 别名
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'components': resolve('src/components'),
      'tools': resolve('src/tools')
    }
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "eslint-loader",
          // enforce: 'pre', // 在babel-loader对源码进行编译前进行lint的检查
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        },
        include: [
          path.resolve('./src/nPages'),
          path.resolve('./src/filters'),
          path.resolve('./src/nStyle'),
          path.resolve('./src/nComponents'),
          path.resolve('./src/plugins'),
          path.resolve('./src/directives'),
          path.resolve('./src/utils')
        ]
      },
      {
        test: /\.css$/,
        include: [ /src/, /swiper/ ],
        use: ExtractTextPlugin.extract({
          publicPath: path.posix.join(config.cssImgPath),
          fallback: "style-loader",
          use: ['css-loader', 'postcss-loader'] //, 'postcss-loader'
        }),
        include: [
          path.resolve('./src/'),
          path.resolve('./node_modules/swiper/dist/css'),
          path.resolve('./node_modules/flatpickr/dist')
        ]
        // exclude: /node_modules/
      },
      {
        test: /\.scss|\.sass$/,
        use: ExtractTextPlugin.extract({
          publicPath: path.posix.join(config.cssImgPath),
          fallback: "style-loader",
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        }),
        exclude: /node_modules/
      },
      {
        test: /\.svg/,
        use: {
          loader: "file-loader",
          options: {
            limit: config.imgTranslateBase64MaxValue || 10000,
            name: 'imgs/[name].[ext]'
          }
        },
        include: [
          path.resolve('./src/')
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: config.imgTranslateBase64MaxValue || 10000,
              name: 'imgs/[name].[ext]'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
};
