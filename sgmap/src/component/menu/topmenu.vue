<template>
  <div class="only-top-menu">
    <sg-menu
      custom
      :customize-style="{fontColor:'#fff',fontColorHover:'#fff',backgroundColor:'transparent', backgroundColorHover:'#182a58'}"
      :horizontal="horizontal"
      :horizontal-o-l="horizontalOL"
      :active-name="active"
    >
      <sg-submenu
        v-for="(item, index) in data"
        :name="item.moduleId"
        :key="index"
      >
        <template slot="title">
          <div style="overflow: hidden;" @click="switchMdl(item)">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              class="imgClass"
            >
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template v-if="item.children && item.children.length">
          <top-sub-menu :data="item.children" />
        </template>
      </sg-submenu>
    </sg-menu>
  </div>
</template>
<script>
import TopSubMenu from './topsubmenu'
export default {
  name: "TopMenu",
  components: { TopSubMenu },
  props:{
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
    horizontalOL: {
      type: Boolean,
      default: false
    },
    active:{
      type:String,
      default: ''
    }
  },
  methods: {
    switchMdl (item) {
      if (item.pageUrl) {
        window.switchMdl(item)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sg-menu {
  background-color: transparent;
}

.sg-menu .sg-menu-item > *,
.sg-menu .sg-menu-submenu-title > * {
  white-space: nowrap;
  vertical-align: middle;
}

.imgClass {
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  left: -100px;
  -webkit-filter: drop-shadow(100px 0 0 #fff);
  filter: drop-shadow(100px 0 0 #fff);
}
</style>
