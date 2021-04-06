# operator-cli

## 项目架构
```
├─testPage  // 本地开发调试页面       
│                  
├─mixins    // 混入
│
├─assets    // 静态资源
│  ├─ scss          // scss样式文件
│       │  common.scss 公共样式
│
├─components  // 通用组件
│  │      datasource    // 数据源选择组件
│  │      selectFields  // 字段选择列表（弹窗）    
│  
├─util  // 工具函数
│  │      index    // 数据源选择组件 
│  
services  // 请求服务
│  │      index    // 拦截器，登录等 
│  │      common   // 通用api
operators     // 算子目录
│   
```

## 使用步骤
### 安装依赖
```
npm install
```

### 创建算子
```
npm run make --cname=创建的算子名称
// 例：npm run make --cname=aggregate
```

### 修改调试页面
在/testPage/index.vue下引入调试的算子组件
```
<script>
import etl from "@/operators/aggregate"

</script>
```

### 打包
```
npm run build --cname=算子名称
// 例：npm run build --cname=aggregate
```

打包后生成zip文件，将zip文件上传到算子管理指定算子中即可使用
