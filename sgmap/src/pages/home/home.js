import Vue from "vue"
import App from "./home.vue"
import store from "@/store"
import '@/assets/scss/base.scss'
import '@/assets/scss/common.scss'
// 引入sgui组件库
import "southgisui/lib/sgui-theme/index.css"
import {SgContainer,
  SgModal,
  SgDropdown,
  SgDropdownItem,
  SgHeader,SgRow,SgCol,SgMenu,SgSubmenu,SgScroll,
  SgAside,
  SgMenuItem,SgIcon,SgMain,SgTab,SgTabPane,SgButton,SgMsg, SgBadge,SgNotice,SgCheckbox} from 'southgisui'
Vue.use(SgBadge)
Vue.use(SgContainer)
Vue.use(SgHeader)
Vue.use(SgRow)
Vue.use(SgCol)
Vue.use(SgMenu)
Vue.use(SgSubmenu)
Vue.use(SgMenuItem)
Vue.use(SgIcon)
Vue.use(SgDropdown)
Vue.use(SgMain)
Vue.use(SgTab)
Vue.use(SgMsg)
Vue.use(SgTabPane)
Vue.use(SgButton)
Vue.use(SgModal)
Vue.use(SgDropdown)
Vue.use(SgDropdownItem)
Vue.use(SgScroll)
Vue.use(SgAside)
Vue.use(SgNotice)
Vue.use(SgCheckbox)
import SgScrollbar from 'southgis-scrollbar'
Vue.component('SgScrollbar',SgScrollbar)
import 'southgis-scrollbar/scrollbar.css'
import DomPortal from 'vue-dom-portal'
Vue.use(DomPortal)
// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
/**
* @Description:判断是否登陆，若未登陆，跳转登录页，登陆完将系统信息存入vuex中
* @author huangjianhui
* @date 2019/10/25
*/
import home from '@/api/home'
import 'exprruntimejs'
//暴露组件库modal方法，供独立脚本（apimgr调用，现有用该方法，等组件库出方案）
window.modal=SgModal

//捕获重定向地址，可配置重定向页（登录页）
const url=fpa.parseUrl().service?fpa.parseUrl().service:'/mainProject/login.html'
home.mpdata({params:fpa.parseUrl()})
  .then(res=>{  
    //如果没有权限
    if(res.noRight){
      localStorage.setItem("noRight",res.noRight);
      if(res.invalid == 10){
        const env=process.env.NODE_ENV;
        let resetPassHtmlSrc = "";
        if(env==='development') {
          resetPassHtmlSrc = '/resetpass.html';
        }else{
          resetPassHtmlSrc = '/mainProject/resetpass.html';
        }
        SgModal.alert({
          title: '首次登陆,请修改密码',         
          similar: true,
          className: 'resetPassModal',
          render: (h) =>{
            return h('iframe',{
              attrs:{
                src: resetPassHtmlSrc
              }
            })
          }
        })
      }else{
        SgModal.alert({
          title: '提示',
          closable: true,
          content:res.noRight,
          okText:'返回登录页',
          onOk: () => {
            location.replace(process.env.NODE_ENV === 'production' ? url : `/login.html`)
          }
        })
      }     
    }else{     
      store.commit('saveMpData',res)
      document.title=res.sysTitle
      new Vue({
        store,
        render: h => h(App)
      }).$mount("#mainProject")
      home.mrdata()
        .then(res=>{
          //子应用可以根据moduleId获取模块权限信息
          //postmessage
          window.addEventListener('message',(event)=>{
            for(let i=0;i<res.length;i++){
              if(res[i].moduleId===event.data.moduleId){
                window.postMessage('message',event)
              }
            }
          })
        })
    }
  }).catch(err => {
    //取消自动重定向，交给apimgr处理
    console.log(err);
  // let errMsg = err.response? err.response.data.msg: err;
    // SgMsg.error('报错：'+ errMsg + '，3秒后退出')
    // setTimeout(() => {
    //   location.replace(process.env.NODE_ENV === 'production' ? url : `/login.html`)
    // },3000)
  })
