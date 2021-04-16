const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  //开发环境配置
  dev: {
    //接口代理地址
    proxy: [{
      //需代理的应用
      // 代理说明：
      // /businesslist  --工作列表
      // /cas  --cas单点登录
      // /mainweb --ibase系统配置服务
      // /formengine  --表单引擎
      // /formdesigner-web  --表单渲染，可打开表单页
      // /userrightmgr  --用户组织管理服务
      // /bootstrap  --静态资源
      context: [
        '/cas', '/mainweb', '/formengine', '/flowdesigner',
        '/userrightmgr', '/businesslist',
        '/formdesigner-web', '/bootstrap',
        '/flowengine', '/natureWeb3', '/message', '/mainProject', '/mapviewmgr', '/gisproc'
      ],
      //代理目标主机
      target: 'http://192.168.10.126' ||  'http://192.168.20.21' || 'http://192.168.10.119',
      //代理域名
      changeOrigin: true,
      // 利用node.js重写domain,解决tomcat接口重定向（302）导致接口跨域问题
      hostRewrite: 'localhost:8081'
    }
    ],
    //host
    host: '0.0.0.0',
    //端口
    port: 8081,
    //开发路径别名
    alias: {
      '@': resolve('src'),
      'vue$': 'vue/dist/vue.esm.js',
      '_c': resolve('src/component'),
      '_p': resolve('src/pages'),
      '_w': resolve('src/webgis/components')
    },
    //自动解析拓展
    extensions: ['.js', '.vue', '.scss']
  },
  build: {
    //输出目标目录
    //输出目录
    assetsRoot: resolve('./mainProject'),
    //输出静态资源目录
    assetsSubDir: 'static',
    //sourcemap配置
    sourcemap: true,
    //是否开启gzip
    gzip: false,
    //开启bundleAnalyzerReport
    bundleAnalyzerReport: false
  }
}
