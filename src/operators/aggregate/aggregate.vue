<template>
    <div class="aggregate">
      <div class="btn-list">
        <sg-button type="primary" :disabled="!allFieldsList.length" @click="onSelectFields">选择</sg-button> 
        <sg-button type="primary" @click="onAppend">新增</sg-button>
        <sg-button type="primary" @click="onMoving('up')">上移</sg-button>
        <sg-button type="primary" @click="onMoving('down')">下移</sg-button>
        <sg-button type="error" @click="onDelete">删除</sg-button>
      </div>
      <sg-table :columns="columns" :data="tableData" @on-selection-change="onSelectionChange" />

      <selectFields v-model="showFields" :fields="allFieldsList" @on-get-selections="onGettingSelections" />
    </div>
</template>
    
<script>
import api from '@/services/common'
import { fieldTypeList } from '@/util'
export default {
  name: 'aggregate',
  components: {
    selectFields: () => import('_c/selectFields')
  },
  data() {
    return {
      showFields: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 60
        },
        {
          title: '字段名称',
          key: 'dst_name',
          render:(h, params) => {
            return h('sg-input', {
              props: {
                value: this.tableData[params.index].dst_name
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'dst_name', e.target.value)
                }
              }
            })
          }
        },
        {
          title: '原始名称',
          key: 'src_name'
        },
        {
          title: '字段标题',
          key: 'columnDescription',
          render: (h, params) => {
            return h('sg-input', {
              props: {
                value: this.tableData[params.index].columnDescription
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'columnDescription', e.target.value)
                }
              }
            })
          }
        },
        {
          title: '字段类型',
          key: 'fieldType',
          render: (h, params) => {
            return h('sg-select', {
              props: {
                value: this.tableData[params.index].fieldType
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'fieldType', e)
                }
              }
            }, this.fieldTypeList.map(val => {
              return h('sg-option', {
                props: {
                  value: val.value,
                  label: val.label
                }
              })
            }))
          }
        },
        {
          title: '字段长度',
          key: 'fieldLength',
          render: (h, params) => {
            return h('sg-input', {
              props: {
                value: this.tableData[params.index].fieldLength
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'fieldLength', e.target.value)
                }
              }
            })
          }
        },
        {
          title: '表达式',
          key: 'expression',
          width: 220,
          render: (h, params) => {
            return h('sg-input', {
              props: {
                value: this.tableData[params.index].expression
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'expression', e.target.value)
                }
              }
            })
            // return h('sg-select', {
            //   props: {
            //     value: this.tableData[params.index].expression,
            //     filterable: true,
            //     multiple: true
            //   },
            //   on: {
            //     'on-change': (e) => {
            //       this.$set(this.tableData[params.index], 'expression', e)
            //     }
            //   }
            // }, this.allFieldsList.map(val => {
            //   return h('sg-option', {
            //     props: {
            //       value: val.fieldName,
            //       label: val.fieldName
            //     }
            //   })
            // }))
          }
        },
        // {
        //   title: '小数精度',
        //   key: 'decimal'
        // },
        {
          title:'分组字段',
          key: 'groupFields',
          render: (h, params) => {
            return h('sg-checkbox', {
              props: {
                value: this.tableData[params.index].groupFields
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'groupFields', e)
                  console.log(this.tableData)
                  if(e) {
                    this.$set(this.tableData[params.index], 'aggregateFunc', '')
                  }
                }
              }
            })
          }
        },
        {
          title:'聚合方法',
          key: 'aggregateFunc',
          render: (h, params) => {
            return h('sg-select', {
              props: {
                value: this.tableData[params.index].aggregateFunc,
                disabled: this.tableData[params.index].groupFields // 分组字段启用就禁用聚合方法
              },
              on: {
                'on-change': (e) => {
                  this.$set(this.tableData[params.index], 'aggregateFunc', e)
                }
              }
            }, this.aggregateFuncList.map(val => {
              return h('sg-option', {
                props: {
                  value: val.value,
                  label: val.label
                }
              })
            }))
          }
        }
      ],
      tableData: [],
      allFieldsList: [],
      aggregateFuncList: Object.freeze([{
        label: '无',
        value: ''
      },{
        label: '求和',
        value: 'sum'
      },{
        label: '平均值',
        value: 'average'
      },{
        label: '最大值',
        value: 'max'
      },{
        label: '最小值',
        value: 'min'
      },{
        label: '计数',
        value: 'count'
      }]),
      fieldTypeList: Object.freeze(fieldTypeList),
      selections: []
    }
  },
  mounted() {
    window.getData = this.getData
    window.addEventListener('message', this.onMessage)
  },
  destroyed() {
    window.removeEventListener('message', this.onMessage)
  },
  methods: {
    onMessage(e) {
      console.log(e)
      if(!e.data) return
      api.preNodeOutfileds({planId: e.data.dayuId, nodeId: e.data.nodeId}).then(res => {
      // api.preNodeOutfileds({planId: 14311, nodeId: 103}).then(res => {
        console.log( Object.values(res))
        this.allFieldsList = Object.values(res).flat()
        // 回显
        if(e.data.params && e.data.params.fields) {
          console.log(e.data.params)
          this.tableData = e.data.params.fields
        }
      }).catch(err => {
        console.error(err)
      })
    },
    // 获取
    onGettingSelections(data) {
      this.tableData = data.map(val => {
        val.src_name = val.fieldName
        val.dst_name = val.fieldName
        // val.expression = []
        return val
      })
    },
    // 新增
    onAppend() {
      this.tableData.push({
        
      })
    },
    // 上移下移
    onMoving(direction) {
      this.selections.forEach(val => {
        const index = this.tableData.findIndex(item => item.src_name === val.fieldName)
        console.log(index)
        if(direction === 'up' && index > 0) {
          this.tableData.splice(index, 1, this.tableData[index-1])
          this.tableData.splice(index - 1, 1, val)
          this.$set(this.tableData[index-1], '_checked' ,true)
        }else if(direction === 'down' && index < this.tableData.length-1) {
          this.tableData.splice(index, 1, this.tableData[index + 1])
          this.tableData.splice(index + 1, 1, val)
          this.$set(this.tableData[index+1], '_checked' ,true)
        }
        this.$set(val, '_checked' ,true)
      })
    },
    // 选择字段
    onSelectFields() {
      this.showFields = true
    },
    // 删除
    onDelete() {
      if(!this.selections.length) {
        this.$msg.warning('请勾选字段')
        return 
      }
      this.selections.forEach(val => {
        const idx = this.tableData.findIndex(item => item.src_name === val.src_name)
        this.tableData.splice(idx, 1)
      })
    },
    onSelectionChange(data) {
      this.tableData.forEach(val => {
        delete val._checked
      })
      console.log(data)
      this.selections = data
    },
    getData() {
      let fields = []
      let outFields = []
      this.tableData.map(val => {
        const {columnDescription,defaultValue,src_name,dst_name,fieldLength,fieldType,isCanNull,isPrimaryKey,tableName,aggregateFunc,expression,groupFields} = val
        fields.push({src_name, dst_name, fieldType, fieldLength, groupFields, expression, aggregateFunc})
        outFields.push({
          value: val.dst_name,
          attribute: {columnDescription,defaultValue,fieldLength,fieldName: dst_name,fieldType,isCanNull,isPrimaryKey,tableName,aggregateFunc,expression,groupFields}
        })
      })
      return {
        fields,
        outFields
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.aggregate{
  .btn-list {
    margin-bottom: 10px;
  }
}
</style>

