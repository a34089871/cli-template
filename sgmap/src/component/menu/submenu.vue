<template>
  <div class="menu-wrap">
    <sg-submenu
      v-if="item.children&&item.children.length>0"
      :name="item.moduleId"
      :placement="placement"
      :transfer="transfer"
      :tooltipText="item.name"
      :title="item.name"
    >
      <template #title>
        <img
          v-if="isFirstL || item.imageUrl"
          :src="item.imageUrl"
          :class="imgClass"
        >
        <span slot="subTitle">{{ item.name }}</span>
      </template>
      <div
        v-for="items in item.children"
        :key="items.moduleId"
      >
        <sub-menu
          v-if="items.children&&items.children.length>0"
          :item="items"
          placement="right-start"
          :is-first-l="false"
        />
        <sg-menu-item
          v-else
          :key="items.name"
          :name="items.moduleId"
          @click.native="addTab(items)"
          :tooltipText="items.name"
          :title="items.name"
        >
          <!--                <sg-icon :type="item.icon"/>-->
          <span slot="title">{{ items.name }}</span>
        </sg-menu-item>
      </div>
    </sg-submenu>
    <sg-menu-item
      v-else
      :name="item.moduleId"
      @click.native="addTab(item, true)"
      :tooltipText="item.name"
      :title="item.name"
    >
      <img
        :src="item.imageUrl"
        :class="imgClass"
      >
      <span slot="title">{{ item.name }}</span>
    </sg-menu-item>
  </div>
</template>

<script>
import emitter from '@/mixins/emitter'
export default {
  name: "SubMenu",
  mixins:[emitter],
  props: {
    //菜单子项
    item: {
      type:Object,
      default: ()=>{
        return {}
      }
    },
    //菜单悬浮展示方向
    placement:{
      type:String,
      default:'right-start'
    },
    transfer:{
      type:Boolean,
      default:true
    },
    isFirstL:{
      type:Boolean,
      default:true
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    imgClass(){
      return[
        'icon',
        {
          'second-level':!this.isFirstL,
          'collapsed': this.isFirstL && this.collapse
        }
      ]
    }
  },
  methods: {
    /**
     * @param flag: 用于区分是否是顶层叶子节点
     **/
    addTab(item, flag = false){
      this.dispatch('MainProject','addTab', [item, this.isFirstL && flag])
    }
  }
}
</script>

<style scoped lang="scss">
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: -4px;
    margin-right: 10px;

    &.second-level {
      width: 14px;
      height: 14px;
      vertical-align: -1px;
    }

    &.collapsed {
      margin-right: 0;
    }
  }

  .sg-menu .sg-menu-item > *,
  .sg-menu .sg-menu-submenu-title > * {
    white-space: nowrap;
    vertical-align: middle;
  }

</style>
