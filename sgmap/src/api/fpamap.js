export default {
  // 数据目录查询
  queryDataDirectory: (data) => axios.get('/mapviewmgr/dataDirectory/query', data),
  // 获取地图基本配置
  queryMapBaseConfig: (data) => axios.get('/mapviewmgr/serviceManagement/queryMapBaseConfig', data),
  // 获取底图配置
  queryBasemapConfig: (data) => axios.get('/mapviewmgr/baseMap/queryByQyzt', data),
  // 行政目录查询
  queryDist: (data) => axios.get('/mapviewmgr/administrativelink/findMapLinkTree', data),
  // 图幅树查询
  queryMappableUnit: (data) => axios.get('/mapviewmgr/mappableUnitMgt/getUnitTree', data), // 查询图幅列表
  // 空间查询
  spaceQuery: (data) => axios.get('/gisproc/spacequery', data),
  // 获取所有服务的查询设置
  getAllQuerySetting: (data) => axios.get('/mapviewmgr/querySetting/getAllQuerySetting', data),

  // 用户授权的地图工具
  getMapToolByUserPerms: (data) => axios.get('/mapviewmgr/mapToolDefinition/getMapToolByUserPerms', data)
}