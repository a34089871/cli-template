const commonConfig = require('./webpack.common')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = commonConfig({
  entry: './testPage/index.js',
  output:{
    path: '/dist'
  },
  devServer: {
    proxy:[{
      changeOrigin: true,
      hostRewrite: 'localhost:8888',
      context: ['/'],
      target: 'http://172.20.20.1'
    }],
    hot: true,
    port: 8888,
    host: 'localhost'
  },
  mode: 'development',
  devtool: 'source-map',
  stats: 'normal', // 只在发生错误或有新的编译时输出
  plugins: [
    new HtmlWebpackPlugin({
      template: `./testPage/index.html`,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
})
