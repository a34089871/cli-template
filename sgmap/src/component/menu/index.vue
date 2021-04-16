<template>
  <div>
    <sg-menu
      :horizontal="horizontal"
      light
      ref="NavWrap"
      :open-names="openName"
      :active-name="active"
      :collapse="collapse"
      :openWidth="openWidth"
      :collapseWidth="collapseWidth"
      :showTooltip="showTooltip"
      :subMenuWidth="200"
      :subMenuMaxHeight="250"
      :icons="icons"
    >
      <sub-menu
        v-for="(item,index) in data"
        :key="index"
        :item="item"
        :collapse="collapse"
      />
    </sg-menu>
  </div>
</template>
<script>
import SubMenu from './submenu'
export default {
  name: "IMenu",
  components:{SubMenu},
  props:{
    moduleId:{
      type: [Array , String]
    },
    //外部数据
    data:{
      type:Array,
      default:()=>{
        return []
      }
    },
    //组件使用方向
    horizontal:{
      type:Boolean,
      default:true
    },
    active:{
      type:String,
      default: ''
    },
    collapse: {
      type: Boolean,
      default: false
    },
    openWidth: {
      type: Number,
      default: 180
    },
    collapseWidth: {
      type: Number,
      default: 50
    },
    showTooltip: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icons () {
      if (this.collapse) {
        return {open: 'iconxiala', close: 'iconxiala'}
      } else {
        return {open: 'icon-add', close: 'icon-reduce'}
      }
    }
  },
  data(){
    return{
      openName:[]
    }
  },
  watch:{
    moduleId:{
      handler(val){
        if(val){
          val.forEach((el)=>{
            if(el.children && el.children.length){
              this.openName.push(el.moduleId)
              this.$nextTick(()=>{
                this.$refs['NavWrap'].updateOpened()
              })
            }
          })
        }
      }
    }
  }
}
</script>
