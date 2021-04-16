# operator-cli

operator-cli 是一个提供给前端开发人员快速搭建项目的前端脚手架，基于Webpack5和nodejs进开发，对构建和编译性能进行了相应的优化，技术栈为Vue，其中提供了部分基础组件和通用接口，以满足项目上算子的前端定制开发需求。

# 项目架构

```
├─testPage  // 本地开发调试页面       
│                  
├─mixins    // 混入
│
├─assets    // 静态资源
│  ├─ scss          // scss样式文件
│       ├─ common.scss 公共样式
│
├─components  // 通用组件
│  ├─ datasource    // 数据源选择组件
│  ├─ selectFields  // 字段选择列表（弹窗）    
│  
├─util  // 工具函数
│  ├─ index    // 数据源选择组件 
│  
├─ services  // 请求服务
│  ├─ index    // 拦截器，登录等 
│  ├─ common   // 通用api
│ 
├─ operators     // 算子目录

```

# 规范

## 通信（参数传递）

由于自定义算子采用iframe的方式嵌入到主页面中，因此产生的父子页面通信问题需要提前约定。

### 父传子（接收参数）
  
自定义算子页面获取当前算子参数，方案id`dayuId`，节点id`nodeId`，节点参数`params`；通过postMessage进行通信，主要用于回显和获取上一个节点的输出参数（下面会讲到）。

```javascript
mounted() {
  window.addEventListener('message', this.onMessage) 
},
destroyed() {
  window.removeEventListener('message', this.onMessage)
},
methods: {
  onMessage(e) {
    console.log(e)
  }
}
```

### 子传父（保存参数）
  
在`window`对象上挂载`getData`方法，将需要保存的参数在`getData`中返回出来，方便父页面获取参数并保存进算子中。

```javascript
mounted() {
  window.getData = this.getData
},
methods: {
 getData() {
    const fields = [{a:1}],
      outFields = 'string'
    return {
      fields,
      outFields
    }
  }
}
```

## 获取上个节点的输出参数

当节点A流向节点B，在节点B中需要获取节点A的参数，我们需要调用`/ispatial-dag/plan/preNodeOutfileds`接口进行获取

```javascript
import api from '@/services/common.js'

export default {

  methods: {
    onMessage(e) {
      if(!e.data) return
      api.preNodeOutfileds({planId: e.data.dayuId, nodeId: e.data.nodeId}).then(res => {
        console.log(res)
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
```



# 使用步骤

## 启动项目

```bash
npm run start
```

## 创建算子模板

```bash
npm run make --cname=创建的算子名称
// 例：npm run make --cname=aggregate
```

## 修改调试页面

在/testPage/index.vue下引入调试的算子组件

```bash
<script>
import etl from "@/operators/aggregate"

</script>
```

## 打包

打包后生成zip文件

```bash
npm run build --cname=算子名称
// 例：npm run build --cname=aggregate
```

## 上传

在算子管理中，选中算子，点击上传，将zip文件上传即可。

[![crBEqJ.png](https://z3.ax1x.com/2021/04/13/crBEqJ.png)](https://imgtu.com/i/crBEqJ)