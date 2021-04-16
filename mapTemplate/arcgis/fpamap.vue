<template>
    <div class="arcgisMap" style="width: 100%;height: 100%;">
      <sg-spin fix v-if="!inited"></sg-spin>
        <arcgis-map
          :id="mapId"
          v-if="inited"
          @loaded="onMapLoad"
          :mapConfig="mapConfig"
          :layerData="layerTreeData"
          :basemapData="basemapConfig"
          ref="map"
        >
          <map-scale-bar></map-scale-bar>
          <map-widget></map-widget>
          <map-cursor-pos :position="'bottom-left'"></map-cursor-pos>
        </arcgis-map>
    </div>
</template>

<script>
import api from '@/api/index'
import ArcgisMap from '_c/arcgisMap/map.vue'
import MapScaleBar from '_c/arcgisMap/mapScaleBar/mapScaleBar.vue'
import MapWidget from '_c/arcgisMap/mapWidget/mapWidget.vue'
import MapCursorPos from '_c/arcgisMap/mapCursorPos/mapCursorPos.vue'
import { isJSON } from '@/util/typeJduge'
import { generateUUID } from '@/util/index'

export default {
  name: "arcgisMapPage",
  components: {
    ArcgisMap, MapScaleBar, MapWidget, MapCursorPos
  },
  data() {
    return {
      inited: false,
      layerTreeData: [],
      basemapConfig: null,
      mapConfig: null,
      mapId: generateUUID()
    }
  },
  methods: {
    /** 事件绑定 */
    /**
     * 文本框数据变化
     */
    onChangeTextarea($event) {
      if ($event !== '' || $event !== null) {
        this.showTextClearBtn = true
      } else {
        this.showTextClearBtn = false
      }
      this.$emit('on-change',$event)
    },

    onClearText() {
      this.polygonCoor = ''
      this.showTextClearBtn = false
    },

    /**
     * 点击图上定位触发
     */
    onClickShowMap() {
      this.showMap = true
      this.handleHighLightOnMap(this.polygonCoor)
    },

    /**
     * 地图加载完成
     */
    onMapLoad(status, map) {
      if (status) {
        this.mapLoaded = true
        this.map = map
      }
    },

    /**
     * 弹窗最大化
     */
    onModalMaxmize($event) {
      if ($event) {
        this.smapWidth = '100%'
        this.smapHeight = document.body.clientHeight - 150 + 'px'
      } else {
        this.smapWidth = this.mapWidth
        this.smapHeight = this.mapHeight
      }
    },

    /**
     * 选择导入不同的类型坐标
     */
    pickCoorClick(type) {
      // console.log('当前类型', type)
      this.selectValue = type
    },

    getCoordinate() {
      this.showPickCoorMenu = !this.showPickCoorMenu
    },

    /**
     * 初始化地图配置参数，通过地图配置接口获取二维地图的主要配置参数
     */
    initMapBaseConfig(data) {
      const config = {}
      if(data.length) {
        data.forEach((data) => {
          if(isJSON(data.configValue)) {
            config[data.configName] = JSON.parse(data.configValue)
          } else {
            config[data.configName] = data.configValue
          }
        })
        this.mapConfig = config
      }
      // console.log('地图配置', config)
    },

    // 获取底图配置
    initBasemapData(baseMapData) {
      for(let item of baseMapData) {
        if(item.fwdz){
          if(item.fwdz && item.fwlx == 'WebMapServiceLayer' && item.fwdz.indexOf('id=')>0){
            let str = item.fwdz.split('/home');
            let portalUrl = str[0];
            let str2 = item.fwdz.split('id=');
            let id = str2[1]
            item.portalItem = {
              id:id,
              portal:{
                url:portalUrl
              }
            }
          }

          this.basemapConfig.push({
            id: item.rid,
            url: item.fwdz,
            layerName: item.dtmc,
            type: item.fwlx,
            portalItem: item.portalItem,
            display: item.mrdt
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
        this.initMapBaseConfig(res[0])
        this.layerTreeData = res[1]
        this.initBasemapData(res[2])
      }).catch(() => {
        
      }).finally(() => {
        this.inited = true
      })
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style scoped lang="scss">
@import "./arcgisMap.scss";
</style>

