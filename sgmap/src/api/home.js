export default {
  //获取用户信息
  mpdata:(data)=>axios.get('/mainweb/mpdata',data),
  //获取用户信息
  mrdata:(data)=>axios.get('/mainweb/mrdata',data),
  //当前用户可用子系统列表
  listSubSystems:()=>axios.get('/mainweb/listSubSystems'),
  //获取环境配置信息
  environmentConfigure:()=>axios.get('/mainweb/system/environmentConfigure')
}
