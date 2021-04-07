import axios from 'axios'
import sha1 from 'sha1'
import { Params2Form } from '@/util'
import qs from 'qs'

function login() {
  sessionStorage.removeItem('token')
  
  axios.create({
    timeout: 100000
  }).get('/cas/oauth2.0/token', {
    params: {
      grant_type: 'password',
      client_id: 'sfpasys',
      username: 'admin',
      password: sha1('Admin123').toUpperCase()
    }
  }).then(res => {
    sessionStorage.setItem('token', res.data.access_token)
  }).catch((err) => {
    this.$msg.error(err.message)
    sessionStorage.setItem('userInfo', 1)
    sessionStorage.setItem('token', 'fkkkliVH')
  })
}

/**
 * 请求之前可以做什么
 */
axios.interceptors.request.use(config => {
  if (config.data && config.data.file) {
    config.headers.common['Content-Type'] = 'multipart/form-data'
    config.data = Params2Form(config.data)
  } else {
    config.headers.common['Content-Type'] = 'application/json'
  }
  if (window.sessionStorage.getItem('token')) {
    const token = window.sessionStorage.getItem('token')
    config.headers.common['X-AToken'] = token
  } else {
    // 当前未登录
    if (window.location.hostname === 'localhost' || window.location.hostname === '172.18.18.5' || window.location.hostname === '127.0.0.1' || window.location.hostname === '192.168.20.11' || window.location.hostname === '172.18.18.134') {
      // 开发环境下 直接尝试登陆，搞成登陆成功
      login()
    }
    // else {
    //   // 否则走到登录页
    //   window.location.replace('/login')
    //   return Promise.reject()
    // }
  }
  if (window.sessionStorage.getItem('userInfo')) {
    const userid = window.sessionStorage.getItem('userInfo')
    config.headers.common['X-AUTH-ID'] = userid
  }
  if (config.method === 'get') {
    // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2,不转换会显示为arr[]=1&arr[]=2
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    }
  }

  return config // 添加这一行
}, error => {
  return Promise.reject(error)
})

/**
 * 返回拦截，可以做些什么
 */
axios.interceptors.response.use(response => {
  const res = response.data
  if (res.errno === 0) {
    // 正常请求 返回结果
    return res.data
  }
  if (response.request != null && response.request.responseType === 'blob') {
    const contentType = response.headers['content-type']
    if (contentType != null && contentType.indexOf('stream') > -1) {
      // 文件下载请求 返回结果
      console.log('文件下载返回处理')
      const url = window.URL.createObjectURL(new Blob([res]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', response.config.params.filename.substring(response.config.params.filename.lastIndexOf('/')).replace('/', ''))
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      return Promise.resolve()
    } else {
      return Promise.reject('下载文件异常，文件可能并不存在')
    }
  }

  return res.data || res
}, error => {
  if (error.response.status === 403) {
    //判断返回内容值
    const data=error.response.data
    //在开发环境下，如果是201或者是110，直接模拟登录
    if (window.top.location.hostname === 'localhost' || window.top.location.hostname === '0.0.0.0') {
      if(data.code===-201||data.code===-110) {
        //如果在开发环境，则弹窗提示，否则跳转到登录页
        login()
      }
    } else {
      // fix-51744
      if(data.code===-201||data.code===-110){
        //如果在登录页上，则不做处理
        // if (window.top.location.pathname !== serviceUrl) {
        //   window.top.location.replace(serviceUrl)
        // }
      }
    }
  }
  if (error.response.status === 500) {
    if (window.Sgui) {
      window.Sgui.$msg.show({
        type: 'error',
        //将提示信息全部展示 #45365
        content: error.response.data.msg.replace('[errs]', '').replace('[erre]', '').split('::')
      })
    }
  }
  return Promise.reject(error)
})
