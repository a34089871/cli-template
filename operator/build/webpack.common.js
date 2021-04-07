const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin')

const fs = require("fs");
// 获取当前工作目录
const appDirectory = fs.realpathSync(process.cwd());

const path = require('path')
const resolve = (dir) => path.resolve(appDirectory, dir)

module.exports = (options) => {
  const { entry, output, devtool, mode, plugins, devServer, stats, optimization } = options
  const isEnvProduction = mode === 'production'

  return {
    entry,
    mode,
    output,
    cache: {
      // 使用持久化缓存
      type: "filesystem" //memory:使用内容缓存 filesystem：使用文件缓存
    },
    devtool,
    performance: false,
    resolve: {
      alias: {
        '@': resolve('src'),
        '_c': resolve('src/components'),
        '_t': resolve('testPage')
      },
      extensions: ['.js', '.vue', '.scss']
    },
    devServer,
    stats,
    module: {
      rules: [
        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   loader: 'eslint-loader',
        //   enforce: 'pre',
        //   options: {
        //     fix: true,
        //     cache: true,
        //     formatter: require('eslint-friendly-formatter')
        //   }
        // },
        {
          oneOf: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: "babel-loader",
                  options: {
                    cacheDirectory: true
                  }
                }
              ]
            },
            {
              test: /\.(sa|sc|c)ss$/,
              use: [
                isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
              ]
            },
            {
              test: /\.(eot|svg|ttf|woff|woff2?)$/,
              type: 'asset/resource',
              generator: {
                filename: 'static/fonts/[hash][ext][query]'
              }
            },
            {
              test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
              type: 'asset/resource',
              generator: {
                filename: 'static/images/[hash][ext][query]'
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new ESLintPlugin({
        fix: true, // 启用ESLint自动修复功能
        extensions: ['js', 'jsx'],
        context: resolve('src'), // 文件根目录
        exclude: '/node_modules/',// 指定要排除的文件/目录
        cache: true //缓存
      }),
      ...plugins
    ],
    optimization

  }
}
