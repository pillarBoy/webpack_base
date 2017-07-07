// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  },
  // 页面入口配置
  entries: {
    index: './src/js/main.js',
    list: './src/js/list.js',
    about: './src/js/about.js'
  },
  // 这是多页入口配置的名字 数组
  pagesList: ['index', 'list', 'about'] // 必须是一个值为 入口名字 字符串 的数组
};
