const path=require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack =require('webpack')
var glob = require('glob');
// 根据项目具体需求，输出正确的 js 和 html 路径
function getEntry(globPath) {
  var entries = {},
    pathname;

  glob.sync(globPath).forEach(function (entry) {
    //方便访问
    pathname = entry.split('/').splice(-1, 1).join('/');
    entries[pathname] = entry;
  });
  return entries;
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
function assetsPath(_path) {
  return path.posix.join(config.build.assetsSubDir, _path)
}
const devModel=process.env.NODE_ENV !== 'production'?true:false
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const config=require('./config');

const page=getEntry('src/pages/**/*.html')
let enter=getEntry('src/pages/**/*.js')
let htmlplugin=[]
let enterArr={}
/**
 * @desicription:动态加载page下面所有页面的${name}.js作为入口文件
 * 并生成html-plugin
 * @author huangjianhui
 * @date 2019/9/21
 */
for (let item in enter) {
  enterArr[item.split('.')[0]]=resolve(enter[item])
}
for(let item in page){
  htmlplugin.push(
    new HtmlWebpackPlugin({
      entryName: item.split('.')[0],
      filename: item,
      template: resolve(page[item]),
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: "dependency",
      chunks: ['vendors','commons',item.split('.')[0]]
    })
  )
}
const webpackconfig= {
  entry:enterArr,
  resolve: {
    extensions:config.dev.extensions,
    alias:config.dev.alias
  },
  // externals: ['vue','vuex'],
  devServer: {
    proxy:config.dev.proxy,
    hot: true,
    port:config.dev.port,
    host: config.dev.host,
    //按需开启
    open:false,
    openPage:'login.html'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src')]

    },{
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [resolve('src')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }},
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        limit: 10000,
        name: assetsPath('images/[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        limit: 10000,
        name: assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    ...htmlplugin,
    new webpack.ProvidePlugin({
      // $:'jquery',
      // jQuery:'jquery',
      // 'window.jQuery':'jquery',
      Vue: ['vue/dist/vue.esm.js', 'default']
    }),
    new StyleLintPlugin({
      files: ['**/*.{vue,htm,html,css,sss,less,scss,sass}']
    })
  ]
}
if(devModel){
  webpackconfig.module.rules.push(
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }
  )
}
else{
  webpackconfig.module.rules.push(
    {
      test: /\.(sa|sc|c)ss$/,
      use: [
        {
          loader:MiniCssExtractPlugin.loader,
          options:{
            publicPath: '../../'
          }
        },
        'css-loader',
        'postcss-loader',
        'sass-loader'
      ]
    }
  )
}
module.exports =webpackconfig
