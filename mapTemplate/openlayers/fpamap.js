import Vue from 'vue'
import App from './fpamap.vue'

import 'southgisui/lib/sgui-theme/index.css'
// import "southgisui/lib/sgui-theme/fpa.css"
import {
  SgSpin,
  SgModal,
  SgUpload,
  SgButton,
  SgTree,
  SgIcon,
  SgSelect,
  SgOption,
  SgInput,
  SgCheckbox,
  SgTab,
  SgTabPane,
  SgMsg,
  SgTable,
  SgNotice,
  SgPage,
  SgRadio,
  SgRadioGroup,
  SgSlider,
  SgInputNumber,
  SgCarousel,
  SgCarouselItem,
  SgImage,
  SgComboTree,
  SgTooltip
} from 'southgisui'

Vue.use(SgSpin)
Vue.use(SgModal)
Vue.use(SgUpload)
Vue.use(SgButton)
Vue.use(SgTree)
Vue.use(SgIcon)
Vue.use(SgSelect)
Vue.use(SgOption)
Vue.use(SgInput)
Vue.use(SgCheckbox)
Vue.use(SgTab)
Vue.use(SgTabPane)
Vue.use(SgMsg)
Vue.use(SgTable)
Vue.use(SgNotice)
Vue.use(SgPage)
Vue.use(SgRadio)
Vue.use(SgRadioGroup)
Vue.use(SgSlider)
Vue.use(SgInputNumber)
Vue.use(SgCarousel)
Vue.use(SgCarouselItem)
Vue.use(SgImage)
Vue.use(SgComboTree)
Vue.use(SgTooltip)

import 'sgmap-class/lib/ol/style/index.css'
import "@/assets/scss/common.scss"
import '@/assets/image/iconfont.css'
require ('@/assets/image/iconfont.js')

import 'sgmap-component/lib/sgmap-component-ol.css'
import sco from 'sgmap-component/lib/sgmap-component-ol.js'
import 'sgmap-class/lib/ol/style/index.css'
Vue.use(sco)

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

new Vue({
  // store,
  render: h => h(App)
}).$mount('#olmap')

