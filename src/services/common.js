import axios from 'axios'
import qs from 'qs'

export default {
  // 根据查询条件查询数据源列表
  searchListByDataSourceType(dataSourceType) {
    return axios.post('/ispatial-dag/externalDataSource/searchListByDataSourceType', qs.stringify({dataSourceType}), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    })
  },
  // 获取表
  getTable(data) {
    return axios.post('/ispatial-dag/externalDataSource/fetchAllTableOrColumn?tName=&searchType=table', data)
  },
  // 获取字段
  getFieldByTable(data) {
    return axios.post(`/ispatial-dag/externalDataSource/fetchAllTableOrColumn?tName=${data.table}&searchType=`, {
      searchTxt: data.searchTxt,
      rows: 2147483647
    })
  },
  // 根据数据源rid获取数据源类型
  findDataSourceInfoByRid(data) {
    return axios.get('/ispatial-dag/externalDataSource/findDataSourceInfoByRid', { params: data })
  },
  // 获取上一个节点的输出字段
  preNodeOutfileds(data) {
    return axios.get(`/ispatial-dag/plan/preNodeOutfileds/${data.planId}/${data.nodeId}`)
  }
}
