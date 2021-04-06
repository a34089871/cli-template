import Vue from 'vue'
import App from './index.vue'

import 'southgisui/lib/sgui-theme/index.css'
import SgButton from 'southgisui/lib/sg-button.js'
import SgModal from 'southgisui/lib/sg-modal.js'
Vue.use(SgButton)
Vue.use(SgModal)

new Vue({
  render: (h) => h(App)
}).$mount('#index')
