<template>
  <div class="select-fields">
    <sg-modal title="拾取字段列表" v-model="show" closable @on-ok="onPickField" @on-cancel="onCancel">
      <sg-input v-model="searchTxt" class="search-input" placeholder="请输入搜索内容" style="width:300px;margin-bottom: 10px;">
        <div slot="append"  @click="searchFields">
          <sg-icon type="iconsousuo" size="14" style="padding: 0 10px"></sg-icon>
        </div>
      </sg-input>
      <div style="width: 60vw;height:70vh;overflow:hidden;">
        <sg-table v-if="show" :columns="pickColomns" :data="currentFields" @on-selection-change="onSelect" />
      </div>
    </sg-modal>
  </div>
</template>

<script>
import {SgModal, SgInput, SgTable, SgIcon} from 'southgisui'
export default {
  components: {
    SgModal, SgInput, SgTable, SgIcon
  },
  props: {
    // 弹窗双向绑定
    value: {
      type: Boolean
    },
    // 字段列表
    fields: {
      type: Array
    }
  },
  data() {
    return {
      pickColomns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '字段名称',
          key: 'fieldName'
        },
        // {
        //   title: '字段标题',
        //   key: 'title'
        // },
        {
          title: '字段类型',
          key: 'fieldType'
        },
        {
          title: '字段长度',
          key: 'fieldLength'
        }
        // {
        //   title: '小数精度',
        //   key: 'decimal'
        // }
      ],
      selections: [],
      show: false,
      searchTxt: '',
      currentFields: []
    }
  },
  watch: {
    value(val) {
      this.show = val
      this.selections = []
      this.currentFields = this.fields
      this.searchTxt = ''
    }
  },
  methods: {
    onSelect(selections) {
      this.selections = selections
    },
    onPickField() {
      console.log(this.selections)
      if(!this.selections.length) {
        this.$msg.warning('请至少选择一条记录！')
        return
      }
      let selections = this.selections.map(val => {
        delete val._checked
        return val
      })
      this.$emit('on-get-selections', selections)
      this.$emit('input', false)
      this.selections = []
    },
    onCancel() {
      this.$emit('input', false)
    },
    // 搜索字段
    searchFields() {
      if(this.searchTxt) {
        this.currentFields = this.fields.filter(val => val.fieldName.includes(this.searchTxt))
      }else {
        this.currentFields = [...this.fields]
      }
    }
  }
}
</script>

<style scoped>

</style>
