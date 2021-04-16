import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mpdata: {},
    environmentConfigure:''
  },
  mutations: {
    saveMpData(state, res) {
      //写入sessionStorg，表达式获取
      //用户id
      sessionStorage.setItem('$user',JSON.stringify(res))
      state.mpdata = res
    },
    saveEnvironmentConfigure(state,config){
      state.environmentConfigure=config
    }
  },
  getters: {
    getMpData: (state) => state.mpdata, 
    getEnvironment:(state)=> state.environmentConfigure
  }
})
