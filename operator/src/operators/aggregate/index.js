import Vue from 'vue'
import aggregate from './aggregate.vue'
import "@/assets/scss/common"
import 'southgisui/lib/sgui-theme/index.css'
import {SgButton,SgTable,SgCheckbox,SgSelect,SgOption,SgMsg} from 'southgisui' // 按需引入sgui组件
import '@/services'

Vue.use(SgButton)
Vue.use(SgTable)
Vue.use(SgCheckbox)
Vue.use(SgSelect)
Vue.use(SgOption)
Vue.use(SgMsg)

if(process.env.NODE_ENV === 'production') {
  new Vue({
    render: h => h(aggregate)
  }).$mount('#aggregate')
}
    
export default aggregate


