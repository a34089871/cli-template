import Vue from "vue"
import App from "./fpamap.vue"

// 引入sgui组件库
import "southgisui/lib/sgui-theme/index.css"
//import "southgisui/lib/sgui-theme/fpa.css"
import {
  SgButton,
  SgButtonGroup,
  SgIcon,
  sgCollapse,
  sgCollapseItem,
  SgSignet,
  SgBadge,
  // form
  SgInput,
  SgCheckbox,
  SgCheckboxGroup,
  SgRadio,
  SgRadioGroup,
  SgSelect,
  SgOption,
  SgCascader,
  SgForm,
  SgFormItem,
  SgDropdown,
  SgDropdownItem,
  SgDatePicker,
  SgInputNumber,
  SgSlider,
  // data
  SgTree,
  SgTable,
  SgPage,
  //nav
  SgTab,
  SgTabPane,
  SgStep,
  SgBreadcrumb,
  SgBreadcrumbItem,
  //server
  SgSpin,
  SgMsg,
  SgProgress,
  SgNotice,
  SgTooltip,
  SgModal,
  SgPreview,
  SgContainer,
  SgMain,
  SgAside,
  SgHeader,
  SgRow,
  SgCol
} from 'southgisui'
// 引入系统样式表

import "./arcgisMap.scss"

Vue.use(SgButton)
Vue.use(SgButtonGroup)
Vue.use(SgIcon)
Vue.use(sgCollapse)
Vue.use(sgCollapseItem)
Vue.use(SgSignet)
Vue.use(SgBadge)
Vue.use(SgInput)
Vue.use(SgCheckbox)
Vue.use(SgCheckboxGroup)
Vue.use(SgRadio)
Vue.use(SgRadioGroup)
Vue.use(SgSelect)
Vue.use(SgOption)
Vue.use(SgCascader)
Vue.use(SgForm)
Vue.use(SgFormItem)
Vue.use(SgDropdown)
Vue.use(SgDropdownItem)
Vue.use(SgDatePicker)
Vue.use(SgInputNumber)
Vue.use(SgSlider)
Vue.use(SgTree)
Vue.use(SgTable)
Vue.use(SgPage)
Vue.use(SgTab)
Vue.use(SgTabPane)
Vue.use(SgStep)
Vue.use(SgBreadcrumb)
Vue.use(SgBreadcrumbItem)
Vue.use(SgSpin)
Vue.use(SgMsg)
Vue.use(SgProgress)
Vue.use(SgNotice)
Vue.use(SgTooltip)
Vue.use(SgModal)
Vue.use(SgContainer)
Vue.use(SgNotice)
Vue.use(SgMain)
Vue.use(SgAside)
Vue.use(SgHeader)
Vue.use(SgPreview)
Vue.use(SgRow)
Vue.use(SgCol)

import "@/assets/scss/common.scss"
import '@/assets/image/iconfont.css'
require ('@/assets/image/iconfont.js')

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount("#arcgisMap")

