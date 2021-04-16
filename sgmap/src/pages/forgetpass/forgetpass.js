import Vue from "vue"
import App from "./forgetpass.vue"

// 引入系统样式表
import "southgisui/lib/sgui-theme/index.css";

import {SgInput,SgButton,SgSelect,SgOption,SgForm,SgFormItem,SgSpin,SgMsg,SgStep,SgRow,SgCol
} from 'southgisui'
Vue.use(SgInput)
Vue.use(SgButton)
Vue.use(SgSelect)
Vue.use(SgOption)
Vue.use(SgForm)
Vue.use(SgFormItem)
Vue.use(SgSpin)
Vue.use(SgMsg)
Vue.use(SgStep)
Vue.use(SgRow)
Vue.use(SgCol)



// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount("#forgetpass")

