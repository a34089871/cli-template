const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.common.js')

let name = process.env.npm_config_cname
if (!name) {
  throw new Error('执行npm run build时必须通过--cname=xxx的格式指定组件所在目录的名称！')
}

module.exports = baseConfig({
  entry: path.resolve(__dirname, '..', `src/operators/${name}/index.js`),
  output: {
    path: path.resolve(__dirname,`../dist/${name}`),
    filename: `static/[name].[contenthash].js`,
    publicPath: "./"
  },
  mode: 'production',
  devtool: 'cheap-source-map',
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true // 开启多线程压缩
      }),
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ],
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          minSize: 30000,
          minChunks: 1,
          chunks: 'initial',
          priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
        },
        commons: {
          test: /[\\/]src[\\/]common[\\/]/,
          name: 'commons',
          minSize: 30000,
          minChunks: 3,
          chunks: 'initial',
          priority: -1,
          reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
        }
      }
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: name,
      entryName: name,
      filename: `${name}.html`,
      templateContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset=UTF-8>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>${name}</title>
        </head>
        <body>
          <div id="${name}"></div>
        </body>
      </html>`,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "css/[name].css",
      ignoreOrder: true// 忽略有关顺序冲突的警告
    }),
    new ZipWebpackPlugin ({
      path:path.join(__dirname,'../dist/'),
      filename: `${name}.zip`,
      pathPrefix: name
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production') // 设置全局
    })
    // new BundleAnalyzerPlugin() // 包体积分析
  ]
})
