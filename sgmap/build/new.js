'use strict';
/**
 * @desicription:新建组件、页面模板
 * 命令：
 * 新建组件  make new component 组件名
 * 新建页面  make new page 页面名
 * @author huangjianhui
 * @date 2019/9/21
 */
process.on('exit', () => {
  console.log();
});

if (!process.argv[2]) {
  console.error('[组件名]必填');
  process.exit(1);
}

const path = require('path');
const fileSave = require('file-save');
const name =process.argv[3]
// 根据项目需求，处理多层级嵌套
// 最后一级为文件创建，前面拼接文件夹名称

//文件名，文件目录
// eslint-disable-next-line no-unused-vars
let fileName='',dirPath=''
// 没有层级的情况下
if(name.indexOf('/')===-1){
  fileName=name
  dirPath='../src/pages'
}else{
  //获取文件名
  fileName=name.split('/').splice(-1,1).toString()
  const pathArr=name.split('/')
  pathArr.pop()
  dirPath='../src/pages'+'/'+pathArr.join('/')
}
const component = path.resolve(__dirname, '../src/component', name);
const page = path.resolve(__dirname,dirPath,fileName)
if(process.argv[2]==='component'){
  const Files = [
    {
      filename: `${name}.js`,
      content: `import ${name} from './${name}.vue';

export default ${name};
`
    },
    {
      filename: `${name}.vue`,
      content: `<template>
    <div class="${name}"></div>
</template>

<script>
export default {
  name: '${name}'
};
</script>
<style lang='scss' scoped>
@import './index.scss';
</style>
`
    },
    {
      filename: path.join('./', `index.scss`),
      content: ``
    }
  ];
    // 创建组件
  Files.forEach(file => {
    fileSave(path.join(component, file.filename))
      .write(file.content, 'utf8')
      .end('\n');
  });
}else if(process.argv[2]==='page'){
  const Files = [
    {
      filename: `${fileName}.js`,
      content: `import Vue from "vue"
import App from "./${fileName}.vue"
import store from "@/store"
// 引入sgui组件库
import "southgisui/lib/sgui-theme/index.css"
//import "southgisui/lib/sgui-theme/fpa.css"
import {
  SgButton
} from 'southgisui'
// 引入系统样式表
import "./${fileName}.scss"

Vue.use(SgButton)
// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount("#${fileName}")
`
    },
    {
      filename: `${fileName}.html`,
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <title>${fileName}</title></head>
<body>
<div id="${fileName}"></div>
</body>
</html>
`
    },
    {
      filename:`${fileName}.vue`,
      content:`<template>
    <div class="${fileName}"></div>
</template>

<script>
export default {
  name: "${fileName}"
}
</script>
`
    },
    {
      filename: path.join('./', `${fileName}.scss`),
      content: ``
    }
  ];
    // 创建页面
  Files.forEach(file => {
    fileSave(path.join(page, file.filename))
      .write(file.content, 'utf8')
      .end('\n');
  });
}


console.log('创建完成');
