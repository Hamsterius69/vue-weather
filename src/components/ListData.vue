<template>
  <div v-for="(item, index) in listData" :key="index" class="row q-my-md">
    <q-icon :name="item.icon" size="32px"/>
    <div class="text-h6"> {{ item.title }} </div>
    <div class="text-body1 q-pl-sm q-pt-xs"> {{ item.response }} </div>
    <!--
    <q-icon :name="item.value.icon" size="32px"/>
    <div class="text-h6"> {{ item.value.title }} </div>
    <div v-if="weatherData.main" class="text-body1 q-pl-sm q-pt-xs"> {{ item.value.response }} </div>
    -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ListData',
  props: {
    listData: {
      type: Array,
      required: true
    }
  }
})
</script>
