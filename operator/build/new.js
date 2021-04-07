'use strict';
/**
 * @description:新建组件模板
 * 命令：
 * 新建组件  npm run make 组件名
 */
const name = process.env.npm_config_cname
if (!name) {
  throw new Error('执行npm run build时必须通过--cname=xxx的格式指定组件所在目录的名称！')
}
const path = require('path');
const fileSave = require('file-save');
const component = path.resolve(__dirname, '../src/operators', name);
const Files = [
  {
    filename: `index.js`,
    content: `import Vue from 'vue'
import ${name} from './${name}.vue'
import "@/assets/scss/common"
import 'southgisui/lib/sgui-theme/index.css'
import {SgButton} from 'southgisui' // 按需引入sgui组件
import '@/services'

Vue.use(SgButton)

if(process.env.NODE_ENV === 'production') {
  new Vue({
    render: h => h(${name})
  }).$mount('#${name}')
}
    
export default ${name}

`
  },
  {
    filename: `${name}.vue`,
    content: `<template>
    <div class="${name}"></div>
</template>
    
<script>
export default {
  name: '${name}',
  data() {
    return {
      
    }
  },
  mounted() {
    window.getData = this.getData // 提前约定的方法，供算子外部获取iframe页面内配置参数
  },
  methods: {
    getData() {
      return {}
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
`
  }
];
// 创建组件
Files.forEach(file => {
  fileSave(path.join(component, file.filename))
    .write(file.content, 'utf8')
    .end('\n');
});



console.log('创建完成');
