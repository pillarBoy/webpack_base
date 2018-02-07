var path = require('path');

function resolve (dir) {
  return path.join(__dirname, '../../public/', dir)
}

module.exports = {
  entry(entry) {
    let entrySettings = {};
    if (Array.isArray(entry)) {
      entry.forEach((page) => {
        entrySettings[page] = `./src/pages/${page}.js`;
      });
    }
    entrySettings.vendors = ['jquery'];
    return entrySettings;
  },
  output(options) {
    return {
      filename: `${options.filename}/[name].[chunkhash:16].js`,
      path: resolve(options.path),   // 配置 打包 目录文件夹 名字
      publicPath: options.publicPath || '',
    }
  }
}
