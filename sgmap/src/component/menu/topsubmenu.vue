<template>
  <div class="top-sub-menu-wrap" style="text-align: left; max-width: 250px; max-height: 450px; overflow-y: auto; overflow-x: hidden;">
      <template v-for="(item, index) in data">
          <sg-submenu :key="index" :title="item.name"
              v-if="item.children && item.children.length>0"
              :name="item.moduleId"
              placement="right-start">
              <template slot="title">
                  <span class="img-wrap">
                      <img v-if="item.imageUrl" :src="item.imageUrl" class="imgClass">
                  </span>
                  <span>{{ item.name }}</span>
                  <sg-icon type="iconxiayibu2" size="14" style="position: absolute; right: 0;"/>
              </template>
              <template v-if="item.children && item.children.length">
                <top-sub-menu :data="item.children"></top-sub-menu>
              </template>
          </sg-submenu>
          <sg-menu-item :title="item.name"
              v-else
              :key="index"
              :name="item.moduleId"
              :tooltipText="item.name"
              @click.native="onMenuItemClick(item)">
              <span class="img-wrap">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="imgClass">
              </span>
              <span>{{ item.name }}</span>
          </sg-menu-item>
      </template>
  </div>
</template>

<script>
import TopSubMenu from './topsubmenu'

export default {
  name: "TopSubMenu",
  components: { TopSubMenu },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    onMenuItemClick (item) {
      let home = this.$root.$children[0]
      if (home.globalTab) {
        if (home.activeName !== home.globalTab.id) {
          window.switchMdl(null, home.globalTab.id, item)
        } else {
          window.addTab(item, home.globalTab)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.sg-menu .sg-menu-item > *,
.sg-menu .sg-menu-submenu-title > * {
  white-space: nowrap;
  vertical-align: middle;
}

.img-wrap,
.imgClass {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.imgClass {
  position: relative;
  left: -100px;
  vertical-align: baseline;
  -webkit-filter: drop-shadow(100px 0 0 #fff);
  filter: drop-shadow(100px 0 0 #fff);
}

</style>
