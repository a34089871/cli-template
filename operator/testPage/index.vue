<template>
  <div class="page">
    <sg-modal title="算子配置" v-model="show" closable @on-ok="getConfigData()">
      <div class="modal-wrapper">
        <component :is="switchpage()" />
      </div>
    </sg-modal>
  </div>
</template>

<script>
import etl from "@/operators/aggregate";
export default {
  data() {
    return {
      page: "test",
      show: true
    }
  },
  components: {
    etl
  },
  methods: {
    switchpage() {
      return etl
    },
    getConfigData() {
      console.log(JSON.stringify(window.getData(), null, 2))
    }
  }
}

</script>

<style scoped>
  .modal-wrapper{
    width: 70vw;
    height: 70vh;
    overflow: auto;
  }
</style>

