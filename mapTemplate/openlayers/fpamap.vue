<template>
  <div style="width: 100%; height: 100%;">
    <sg-spin fix v-if="!inited"></sg-spin>
    <ol-map
      v-if="inited"
      @loaded="onMapLoaded"
      :mapConfig="mapConfig"
      :layerData="layerTreeData"
      :basemapData="baseMapData"
    >
      <div v-if="mapLoaded" class="tool">
        <!-- 地图浏览组件 -->
        <map-widget :mapWidgetConfigAry="mapWidgetConfigAry"></map-widget>

        <!-- 地图功能组件 -->
        <map-tool-box :mapToolBoxConfigAry="mapToolBoxConfigAry"></map-tool-box>

        <!-- 底图切换组件 -->
        <map-base-layer></map-base-layer>

        <!-- 比例尺 -->
        <map-scale-bar position="top-left"></map-scale-bar>

        <!-- 层级和坐标 -->
        <map-cursor-pos></map-cursor-pos>

        <!-- normal,fly -->
        <side layout="normal"
              :menuList="menu"
              :expand="false"
              @on-menu-item-change="handleMenuItemChange">
          <data-catalog v-show="dynComponet === 'dataCatalog'"></data-catalog>
          <district-catalog v-show="dynComponet === 'districtCatalog'"></district-catalog>
          <unit-catalog v-show="dynComponet === 'unitCatalog'"></unit-catalog>
          <data-query v-show="dynComponet === 'queryData'"></data-query>
        </side>
      </div>
    </ol-map>
  </div>
</template>

<script>
import api from '@/api/fpamap'
import util from '@/assets/js/utils'

export default {
  name: 'olMapPage',
  data() {
    return {
      inited: false,
      mapLoaded: false,
      mapConfig: null, // 地图初始配置
      menu: [
        {
          class: 'iconshujumulu',
          name: "data-catalog",
          label: "数据目录",
          component: "dataCatalog", //组件名称
          visible: true
        },
        {
          class: 'iconhangzhengmulu1',
          name: "administrative-catalog",
          label: "行政目录",
          component: "districtCatalog",
          visible: true
        },
        {
          class: 'icontufumulu1',
          name: "mappable-catalog",
          label: "图幅目录",
          component: "unitCatalog",
          visible: true
        },
        {
          class: 'iconshujuchaxun1',
          name: "data-query",
          label: "数据查询",
          component: "queryData",
          visible: true
        }
      ],
      dynComponet: 'dataCatalog',
      layerTreeData: null,
      baseMapData: [],
      mapWidgetConfigAry: [], // 地图工具配置
      mapToolBoxConfigAry: [] // 菜单工具配置
    }
  },
  methods: {
    /**
     * 初始化地图配置参数，通过地图配置接口获取二维地图的主要配置参数
     */
    initMapConfig(data) {
      const config = {}
      if (data.length) {
        data.forEach((data) => {
          if (util.isJSON(data.configValue)) {
            config[data.configName] = JSON.parse(data.configValue)
          } else {
            config[data.configName] = data.configValue
          }
        })
      }
      // console.log('地图配置', config)
      this.mapConfig = config
    },

    // 获取底图配置
    initBasemapData(baseMapData) {
      for (let item of baseMapData) {
        if (item.fwdz) {
          this.baseMapData.push({
            url: item.fwdz,
            image: item.image,
            name: item.dtmc,
            visible: Boolean(item.mrdt), // 底图有无被选中
            id: item.rid,
            type: item.fwlx,
            baseLayer: true // 底图属性
          })
        }
      }
    },

    // 初始化地图数据
    initData() {
      const configPromise = api.queryMapBaseConfig()
      const dataDirectoryPromise = api.queryDataDirectory({params: {type: 1}})
      const basemapPromise = api.queryBasemapConfig({params: {qyzt: true}})
      Promise.all([configPromise, dataDirectoryPromise, basemapPromise]).then(res => {
        // console.log(res)
        this.initMapConfig(res[0])
        this.layerTreeData = res[1]
        this.initBasemapData(res[2])
      }).catch(() => {

      }).finally(() => {
        this.inited = true
      })
    },

    handleMenuItemChange(item){
      this.dynComponet = item.component
    },

    initToolConfig(){
      let params = {
        toolType: 0 // 0 为 地图工具，1 为 菜单工具
      }
      api.getMapToolByUserPerms({params}).then(res => {
        if (res.res === 1){
          // 显示规则
          // ['zoomInBtnFun', 'zoomOutBtn', 'initViewBtn']
          res.result.forEach(item => {
            this.mapWidgetConfigAry.push(item.funName)
          });
        }
      })

      params = {
        toolType: 1
      }
      api.getMapToolByUserPerms({params}).then(res => {
        if (res.res === 1){
          // 显示规则
          // [{funName: ''}, {funName: '', children:[{funName: ''}, {funName: ''}]}]
          this.mapToolBoxConfigAry = res.result.map(menuItem => {
            if (menuItem.children.length) {
              let childrenMenu = menuItem.children.map(childMenu => { return {funName: childMenu.funName} })
              return {funName: menuItem.funName, children: childrenMenu}
            } else {
              return {funName: menuItem.funName}
            }
          })
        }
      })
    },

    onMapLoaded(map) {
      this.mapLoaded = true
      console.log('地图对象', map)
    }
  },
  mounted() {
    this.initData()
    this.initToolConfig() // 获取配置工具的请求
  }
}
</script>

<style scoped>

</style>
