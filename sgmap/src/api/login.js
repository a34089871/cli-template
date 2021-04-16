import qs from 'qs'
export default {
  //登陆获取token
  login:(data,config)=>axios.get('/cas/oauth2.0/token',data,config),
  //获取所有子系统信息
  listAllSubSystems:()=>axios.get('/mainweb/public/listAllSubSystems'),
  //获取当前用户可用子系统列表
  listSubSystems:()=>axios.get('/mainweb/listSubSystems'),
  //获取环境配置信息
  loginset:()=>axios.get('/cas/loginset'),
  //修改密码
  modifyMypwd(data) {
    return axios.post('/mainweb/personal/modifyMypwd', qs.stringify(data))
  },
  listConfigure: data => axios.get('/mainweb/system/listConfigure', data),
  //获取环境配置信息
  environmentConfigure:(data)=>axios.get('/mainweb/system/public/environmentConfigure',data),
  //重置密码
  forgetPwd:(data)=>axios.get('/mainweb/public/forgetPwd',data),
  //请求验证码
  requestCaptchaImage:(data)=>axios.get('/mainweb/public/personal/register/captcha-image',data),
  //账户信息验证
  verificationOfAccountInformation(data){
    return axios.post('/mainweb/public/verificationOfAccountInformation', qs.stringify(data))
  },
  //发送验证码
  sendPhoneCodeSMS(data){
    return axios.post('/mainweb/public/sendPhoneCodeSMS', qs.stringify(data))
  },
  //通过验证方式验证用户身份
  verificationCode(data){
    return axios.post('/mainweb/public/verificationCode', qs.stringify(data))
  },
  //保存新密码 
  saveNewPasword(data){
    return axios.post('/mainweb/public/saveNewPasword', qs.stringify(data))  
  }
}

