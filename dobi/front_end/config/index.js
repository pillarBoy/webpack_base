let version = "v0.0.14"
var path = require("path");

module.exports = {
  entry: [
    // index
    "index.index",
    "mob.index.index", "mob.index.register", "mob.index.login",
    // trade
    "trade.index",
    "mob.trade.index",
    // user
    "user.index", "user.realinfo", "user.success", "user.coinin","user.coinout", "user.trust", "user.deal", "user.mplan", "user.candy",
    "mob.user.index", "mob.user.realinfo", "mob.user.coinin", "mob.user.coinout", "mob.user.trust", "mob.user.deal", "mob.user.mplan", "mob.user.candy",
    // news
    "news.index", "news.detail",
  ],
  // 入口 js 文件 名字 ,
  output: {
    filename: 'js', // 配置 js 输出文件夹 名字
    path: "",   // 配置 打包 目录文件夹 名字
    publicPath: "/",         // html 文件路径公共 路径
    version: version
  },
  cssImgPath: '/', // css 的图片 公共 路径
  devUglify: false, // 开发环境 是否压缩 js css
  proUglify: true, // 生产环境 是否压缩 js css
  imgTranslateBase64MaxValue: 10000,
  env: {
    dev: {
      BundleAnalyzer: false
    },
    build: {
      BundleAnalyzer: false
    }
  }
}
