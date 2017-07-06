// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  /*
  // package.json browsers setting
  // "browserslist": [
  //   "> 1%",
  //   "last 2 versions",
  //   "not ie <= 8"
  // ]
  // "plugins": {
  //   // to edit target browsers: use "browserlist" field in package.json
  //   "autoprefixer": {}
  // }
  */
  plugins: [
    require('precss'),
    require('autoprefixer')({
      browsers: [
        '> 0.01%',
        'Last 100 versions',
        'Firefox >= 20',
        'IE >= 8',
        'iOS > 7',
        'last 100 Opera versions'
      ]
    })
  ]
}
