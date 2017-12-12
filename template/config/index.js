// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var proxyDev = require('./proxyTable.dev')
var proxyPro = require('./proxyTable.pro')
var proxyTest = require('./proxyTable.test')
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'loanm.ppdaicdn.com/PPdaiStore/static',
    assetsPublicPath: 'https://',
    // assetsSubDirectory: 'static',
    // assetsPublicPath: '../',
    assetsModuleDirectory: 'module',
    htmlRoot: path.resolve(__dirname, '../../ppdai-store-web/src/main/resources/templates'),//页面的产出目录
    javaRoot: path.resolve(__dirname, '../../ppdai-store-web'), //后端文件路径
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  test: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'loanm.ppdaicdn.com/PPdaiStore/static',
    assetsPublicPath: 'http://',
    // assetsSubDirectory: 'static',
    // assetsPublicPath: '../',
    assetsModuleDirectory: 'module',
    htmlRoot: path.resolve(__dirname, '../../ppdai-store-web/src/main/resources/templates'),//页面的产出目录
    javaRoot: path.resolve(__dirname, '../../ppdai-store-web'), //后端文件路径
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8181,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: proxyTest,//本地联调数据,需要配置相应的proxyTable.dev.js文件
    // proxyTable: proxyPro,//前后端联调数据
    cssSourceMap: false
  }
}
