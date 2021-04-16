import Vue from "vue"
import App from "./login.vue"

// 引入系统样式表
import "./login.scss"
import "southgisui/lib/sgui-theme/index.css";

import {SgMsg,SgDropdown,SgIcon,
  SgDropdownItem,SgInput,SgButton,SgSelect,SgOption,SgForm,SgFormItem,SgModal
} from 'southgisui'
Vue.use(SgMsg)
Vue.use(SgDropdown)
Vue.use(SgIcon)
Vue.use(SgDropdownItem)
Vue.use(SgInput)
Vue.use(SgButton)
Vue.use(SgSelect)
Vue.use(SgOption)
Vue.use(SgForm)
Vue.use(SgFormItem)
Vue.use(SgModal)



// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount("#login")

