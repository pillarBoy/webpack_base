var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('../config');

function mkHtml(pageList, env) {
  if (!pageList instanceof Array) throw console.error("pageList must be an array!");
  //
  let pagesHtmls = [];

  pageList.forEach(function(pageName) {
    let option = env === 'production' ? { // 根据模板插入css/js等生成最终HTML
      favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
      filename: `./${pageName}.html`, // 生成的html存放路径，相对于path
      template: `./src/views/${pageName}.html`, // html模板路径
      inject: true, // js插入的位置，true/'head'/'body'/false
      hash: true, // 为静态资源生成hash值
      chunks: ['vendors', pageName], // 需要引入的chunk，不配置就会引入所有页面的资源
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    } : {
      filename: `./${pageName}.html`,
      template: `./src/views/${pageName}.html`,
      inject: true
    };

    pagesHtmls.push(new HtmlWebpackPlugin(option));
  });
  return pagesHtmls;
}
// let arr = ['app', 'list'];
// console.log(mkHtml(arr));
module.exports = mkHtml;
