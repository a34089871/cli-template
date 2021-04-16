'use strict'
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('./config')
const webpackConfig = require('./webpackPro')

const spinner = ora('打包中...')
spinner.start()
//使用rm先删除已打包目录
rm(path.join(config.build.assetsRoot), err => {
  if (err) throw err
  //删除成功开始打包
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  打包失败 \n'))
      process.exit(1)
    }

    console.log(chalk.cyan(' 打包完成.\n'))
  })
})
