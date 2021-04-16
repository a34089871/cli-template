import Vue from "vue"
import App from "./msgconfig.vue"

// 引入系统样式表
// import "southgisui/lib/sgui-theme/index.css";

import { SgButton, SgCheckbox } from 'southgisui'
Vue.use(SgButton)
Vue.use(SgCheckbox)


// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount("#app")

