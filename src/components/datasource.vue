<template>
  <div class="data-source">
    <sg-form ref="sourceForm" :model="form" :rules="ruleValidate" :label-width="100" @submit.native.prevent >
      <sg-form-item prop="type" label="数据源类型">
        <sg-select v-model="form.type" @on-change="onTypeChange">
          <sg-option v-for="item in typeList" :key="item.value" :value="item.value">{{item.label}}</sg-option>
        </sg-select>
      </sg-form-item>
      <sg-form-item prop="info" label="数据源信息" >
        <sg-select v-model="form.info" :disabled="!infoList.length" filterable @on-change="onInfoChange">
          <sg-option v-for="item in infoList" :key="item.rid" :value="item.rid" >{{item.dataSourceName}}</sg-option>
        </sg-select>
      </sg-form-item>
      <sg-form-item prop="table" label="选择表" >
        <sg-select v-model="form.table" :disabled="!tableList.length" filterable @on-change="onTableChange" @on-open-change="onTableOpen">
          <sg-option v-for="item in tableList" :key="item.tablename" :value="item.tablename">{{item.tableDescription}}{{item.tablename}}</sg-option>
        </sg-select>
      </sg-form-item>
    </sg-form>
  </div>
</template>

<script>
import api from '@/services/common'
import {SgForm,SgFormItem,SgLoading,SgSelect,SgOption} from 'southgisui'
import Vue from 'vue'
Vue.use(SgLoading)
export default {
  components: {SgForm,SgFormItem,SgSelect,SgOption},
  data() {
    return {
      form: {
        type: '',
        info: '',
        table: ''
      },
      typeList: [{ value: 1, label: '空间数据源' }, { value: 2, label: '非空间数据源' }, { value: 3, label: '接口数据源' }, { value: 4, label: 'FTP数据源' }, { value: 'none', label: '无数据源' }],
      infoList: [],
      tableList: [],
      searchTxt: '',
      handOpen: false,
      ruleValidate: {
        type: [
          {required: true, message: '请选择数据源类型'}
        ],
        info: [
          {required: true, message: '请选择数据源信息'}
        ],
        table: [
          {required: true, message: '请选择表'}
        ]
      }
    }
  },
  methods: {
    onTypeChange(val) {
      this.form.info = ''
      api.searchListByDataSourceType(val).then(res => {
        this.infoList = res
      }).catch(err => {
        console.log(err)
        // this.$msg.error(err.response.data.message)
      })
    },
    onInfoChange(val) {
      this.form.table = ''
      this.infoList.forEach(item => {
        if(item.rid === val) {
          console.log(item)
          this.searchTxt = item
          api.getTable({searchTxt: JSON.stringify(item), rows: 2147483647}).then(res => {
            this.tableList = res.queryList || []
          }).catch(err => {
            this.$msg.error(err.response.data.msg)
          })
        }
      })
    },
    onTableOpen(val) {
      if(val) {
        this.handOpen = true
      }
    },
    async onTableChange(val) {
      if(!this.handOpen) return // 手动打开选择才加载数据
      const res = await api.getFieldByTable({searchTxt: JSON.stringify(this.searchTxt), table:val})
      this.$emit('get-fields', res.queryList.length && res.queryList[0].fieldItems)
    },
    // 获取数据源，在父组件调用
    getSource() {
      let { info, table } = this.form
      return [{
        datasourceRid: info,
        value: table
      }]
    },
    // 设置数据源（回显），在父组件调用
    async setSource(data) {
      if(!data[0].datasourceRid) return 
      await api.findDataSourceInfoByRid({ rid: data[0].datasourceRid }).then(res => {
        console.log(1);
        this.$set(this.form, 'type', res.dataSourceType )
      }).catch(err => {
        console.error(err)
      })
      await api.searchListByDataSourceType(this.form.type).then(res => {
        this.infoList = res
        this.$set(this.form, 'info', data[0].datasourceRid )
        console.log(2);
      }).catch(err => {
        console.log(err)
        this.$msg.error(err.response.data.message)
      })
      this.infoList.forEach(item => {
        if(item.rid === this.form.info) {
          console.log(item)
          this.searchTxt = item
          api.getTable({searchTxt: JSON.stringify(item), rows: 2147483647}).then(res => {
            this.$set(this.form, 'table', data[0].value )
            this.tableList = res.queryList || []
            console.log(this.tableList);
          }).catch(err => {
            this.$msg.error(err.response.data.msg)
          })
        }
      })
    },
    validateForm() {
      let res = false
      this.$refs.sourceForm.validate(valid => {
        res = valid
      })
      return res
    }
  }
}
</script>

<style scoped>
  
</style>
